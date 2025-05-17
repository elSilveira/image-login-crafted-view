import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    Calendar,
    Clock,
    User,
    MapPin,
    Check,
    X,
    ArrowRight,
    AlertTriangle,
    Phone,
    Mail,
    RefreshCw,
    Info,
    MoreHorizontal
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { updateAppointmentStatus } from "@/lib/api";
import ProfessionalRescheduleModal from "@/components/professional/ProfessionalRescheduleModal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define appointment interface
interface Service {
    id: string;
    name: string;
    duration?: number;
    price?: number | string;
}

interface Appointment {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    notes?: string;
    location?: string;
    service?: Service;
    services?: { service: Service }[];
    user?: {
        id: string;
        name: string;
        email?: string;
        phone?: string;
    };
}

interface ProfessionalBookingsListProps {
    appointments: Appointment[];
    showActions: boolean;
    emptyMessage: string;
}

const ProfessionalBookingsList = ({
    appointments,
    showActions,
    emptyMessage
}: ProfessionalBookingsListProps) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
    const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
    const [expandedAppointmentId, setExpandedAppointmentId] = useState<string | null>(null);    // Debug: Log appointments received by this component (disabled for production)
    /*
    useEffect(() => {
        console.log('ProfessionalBookingsList received appointments:', appointments);
        console.log('showActions flag value:', showActions);

        if (appointments && appointments.length > 0) {
            console.log('First appointment sample:', appointments[0]);

            // Check if the appointment has a valid status
            if (!appointments[0].status) {
                console.error('Appointment is missing status property:', appointments[0]);
            } else {
                console.log('Status of first appointment:', appointments[0].status);
                console.log('Status type:', typeof appointments[0].status);
                // Check if it's in lowercase to avoid case-sensitivity issues
                console.log('Is status lowercase?', appointments[0].status === appointments[0].status.toLowerCase());
            }

            // Check if services property exists
            if (!appointments[0].services && !appointments[0].service) {
                console.error('Appointment is missing both services and service properties:', appointments[0]);
            }
        } else {
            console.log('No appointments received');
        }
    }, [appointments]);
    */

    // Function to get the main service name
    const getServiceName = (appointment: Appointment): string => {
        if (appointment.service?.name) {
            return appointment.service.name;
        }

        if (appointment.services && appointment.services.length > 0) {
            const serviceCount = appointment.services.length;
            const firstServiceName = appointment.services[0].service?.name || "Serviço";

            return serviceCount > 1
                ? `${firstServiceName} + ${serviceCount - 1} ${serviceCount > 2 ? 'serviços' : 'serviço'}`
                : firstServiceName;
        }

        return "Serviço não identificado";
    };    // Handle status update (confirm/cancel/complete)
    const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
        setIsProcessing(appointmentId);

        try {
            // Additional validation before updating status
            if (newStatus.toLowerCase() === "no_show") {
                // Find the appointment
                const appointment = appointments.find(a => a.id === appointmentId);
                if (!appointment) {
                    throw new Error("Agendamento não encontrado");
                }
                
                // Check if the appointment time has passed
                const appointmentTime = new Date(appointment.startTime);
                const now = new Date();
                
                if (appointmentTime > now) {
                    toast({
                        title: "Operação não permitida",
                        description: "Só é possível marcar como 'Não Compareceu' após o horário agendado.",
                        variant: "destructive",
                    });
                    setIsProcessing(null);
                    return;
                }
            }
            
            // Normalize status based on APPOINTMENT_STATUS documentation
            let normalizedStatus = newStatus;
            
            // Make sure we're using the proper format for API calls
            if (newStatus.toLowerCase() === "in-progress") {
                normalizedStatus = "in_progress";
            } else if (newStatus.toLowerCase() === "no-show") {
                normalizedStatus = "no_show";
            }
            
            await updateAppointmentStatus(appointmentId, normalizedStatus);

            // Show success message
            let actionText;

            switch (normalizedStatus.toLowerCase()) {
                case 'confirmed':
                    actionText = 'confirmado';
                    break;
                case 'cancelled':
                    actionText = 'cancelado';
                    break;
                case 'completed':
                    actionText = 'concluído';
                    break;
                case 'in_progress':
                    actionText = 'marcado como em andamento';
                    break;
                case 'no_show':
                    actionText = 'marcado como não compareceu';
                    break;
                default:
                    actionText = 'atualizado';
            }

            toast({
                title: "Status atualizado",
                description: `O agendamento foi ${actionText} com sucesso.`,
                variant: "default",
            });

            // Refresh the appointments data
            queryClient.invalidateQueries({ queryKey: ["professionalBookings"] });
        } catch (error: any) {
            console.error("Erro ao atualizar status:", error);
            toast({
                title: "Erro",
                description: error.message || "Não foi possível atualizar o status do agendamento.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(null);
        }
    };

    // Open cancel confirmation dialog
    const openCancelDialog = (appointment: Appointment) => {
        setAppointmentToCancel(appointment);
    };

    // Open reschedule modal
    const openRescheduleModal = (appointment: Appointment) => {
        setRescheduleAppointment(appointment);
    };

    // Handle reschedule completion
    const handleRescheduleComplete = () => {
        setRescheduleAppointment(null);
        queryClient.invalidateQueries({ queryKey: ["professionalBookings"] });
    };
    // Format and display status badge
    const getStatusBadge = (status: string) => {
        const lowerStatus = status.toLowerCase();
        switch (lowerStatus) {
            case "confirmed":
                return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
            case "in-progress":
            case "inprogress":
            case "in_progress":
                return <Badge className="bg-blue-100 text-blue-800">Em andamento</Badge>;
            case "completed":
                return <Badge className="bg-purple-100 text-purple-800">Concluído</Badge>;
            case "cancelled":
                return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
            case "no-show":
            case "noshow":
            case "no_show":
                return <Badge className="bg-gray-100 text-gray-800">Não compareceu</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
        }
    };

    // Toggle expanded appointment card
    const toggleExpandAppointment = (appointmentId: string) => {
        setExpandedAppointmentId(expandedAppointmentId === appointmentId ? null : appointmentId);
    };    // Function to determine if an appointment can be marked as No-Show
    const canMarkAsNoShow = (appointment: Appointment): boolean => {
        const lowerStatus = appointment.status.toLowerCase();
        const appointmentTime = new Date(appointment.startTime);
        const now = new Date();
        
        // According to the documentation and requirements:
        // 1. Only pending and confirmed appointments can be marked as no-show
        // 2. It should only be possible after the appointment time has passed
        return (lowerStatus === "pending" || lowerStatus === "confirmed") && 
               (appointmentTime < now);
    };
    
    // Function to check if appointment time has passed
    const hasAppointmentTimePassed = (appointment: Appointment): boolean => {
        const appointmentTime = new Date(appointment.startTime);
        const now = new Date();
        return appointmentTime < now;
    };
    
    if (!appointments || appointments.length === 0) {
        // No appointments to display, show empty message
        return (
            <Card className="w-full">
                <CardContent className="flex flex-col items-center justify-center py-10">
                    <Calendar className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
                    <p className="text-muted-foreground">{emptyMessage}</p>
                </CardContent>
            </Card>
        );
    }    return (
        <div className="space-y-3">
            {appointments.map((appointment) => (
                <Card
                    key={appointment.id}
                    className={`overflow-hidden transition-all duration-200 hover:shadow-md ${expandedAppointmentId === appointment.id ? 'ring-2 ring-primary/20' : ''
                        }`}
                    onClick={() => toggleExpandAppointment(appointment.id)}
                >
                    <CardContent className="p-0">
                        <div className="p-4 bg-white cursor-pointer">
                            <div className="flex justify-between items-center flex-wrap">
                                <div className="flex items-center gap-3">                <div className={`p-2 rounded-full ${appointment.status.toLowerCase() === "pending" ? "bg-yellow-100" :
                                        appointment.status.toLowerCase() === "confirmed" ? "bg-green-100" :
                                            appointment.status.toLowerCase() === "in-progress" ||
                                                appointment.status.toLowerCase() === "inprogress" ||
                                                appointment.status.toLowerCase() === "in_progress" ? "bg-blue-100" :
                                                appointment.status.toLowerCase() === "completed" ? "bg-purple-100" :
                                                    appointment.status.toLowerCase() === "cancelled" ? "bg-red-100" : "bg-gray-100"
                                    }`}>
                                    {appointment.status.toLowerCase() === "pending" ? <Clock className="h-5 w-5 text-yellow-600" /> :
                                        appointment.status.toLowerCase() === "confirmed" ? <Check className="h-5 w-5 text-green-600" /> :
                                            appointment.status.toLowerCase() === "in-progress" ||
                                                appointment.status.toLowerCase() === "inprogress" ||
                                                appointment.status.toLowerCase() === "in_progress" ? <ArrowRight className="h-5 w-5 text-blue-600" /> :
                                                appointment.status.toLowerCase() === "completed" ? <Check className="h-5 w-5 text-purple-600" /> :
                                                    appointment.status.toLowerCase() === "cancelled" ? <X className="h-5 w-5 text-red-600" /> :
                                                        <Clock className="h-5 w-5 text-gray-600" />
                                    }
                                </div>
                                    <div>
                                        <h3 className="font-medium truncate max-w-[200px] sm:max-w-[300px]">
                                            {getServiceName(appointment)}
                                        </h3>
                                        <div className="flex items-center flex-wrap text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            <span className="mr-2">
                                                {format(new Date(appointment.startTime), "dd/MM/yyyy")}
                                            </span>
                                            <Clock className="h-3 w-3 mr-1" />
                                            <span className="mr-2">
                                                {format(new Date(appointment.startTime), "HH:mm")}
                                            </span>
                                            <User className="h-3 w-3 mr-1" />
                                            <span className="truncate max-w-[150px]">
                                                {appointment.user?.name || "Cliente"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-start gap-2 relative mt-2 sm:mt-0 ml-0 sm:ml-2" style={{ zIndex: 30, minWidth: '120px' }}>                                    {showActions && (
                                        <>
                                            {/* For past appointments (pending/confirmed), only show attended/no-show buttons */}
                                            {(appointment.status.toLowerCase() === "pending" || appointment.status.toLowerCase() === "confirmed") && 
                                             hasAppointmentTimePassed(appointment) && (
                                                <>
                                                    {/* Mark as Attended button */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700 border-purple-200 py-1 px-2 h-auto whitespace-nowrap"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusUpdate(appointment.id, "completed");
                                                        }}
                                                        disabled={isProcessing === appointment.id}
                                                    >
                                                        {isProcessing === appointment.id ?
                                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" /> :
                                                            <Check className="h-4 w-4 mr-1" />
                                                        }
                                                        Atendido
                                                    </Button>
                                                    
                                                    {/* Mark as No-Show button */}
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm" 
                                                                    className="bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700 border-gray-200 py-1 px-2 h-auto whitespace-nowrap"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleStatusUpdate(appointment.id, "no_show");
                                                                    }}
                                                                    disabled={isProcessing === appointment.id}
                                                                >
                                                                    {isProcessing === appointment.id ? 
                                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : 
                                                                        <X className="h-4 w-4 mr-1" />
                                                                    }
                                                                    Não Compareceu
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Marcar que o cliente não compareceu ao horário agendado</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </>
                                            )}
                                            
                                            {/* For upcoming appointments, show normal action buttons */}
                                            {/* Confirm button for pending upcoming appointments */}
                                            {appointment.status.toLowerCase() === "pending" && !hasAppointmentTimePassed(appointment) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200 py-1 px-2 h-auto whitespace-nowrap"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusUpdate(appointment.id, "confirmed");
                                                    }}
                                                    disabled={isProcessing === appointment.id}
                                                >
                                                    {isProcessing === appointment.id ?
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> :
                                                        <Check className="h-4 w-4 mr-1" />
                                                    }
                                                    Confirmar
                                                </Button>
                                            )}
                                            
                                            {/* Status indicator for confirmed upcoming appointments */}                      
                                            {appointment.status.toLowerCase() === "confirmed" && !hasAppointmentTimePassed(appointment) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600 border-green-200 py-1 px-2 h-auto whitespace-nowrap cursor-default"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Just prevent card expansion
                                                    }}
                                                    disabled={isProcessing === appointment.id}
                                                >
                                                    {isProcessing === appointment.id ?
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> :
                                                        <Check className="h-4 w-4 mr-1" />
                                                    }
                                                    Confirmado
                                                </Button>
                                            )}
                                            
                                            {/* Complete button for in-progress appointments */}                      
                                            {(appointment.status.toLowerCase() === "in-progress" ||
                                                appointment.status.toLowerCase() === "inprogress" ||
                                                appointment.status.toLowerCase() === "in_progress") && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700 border-purple-200 py-1 px-2 h-auto whitespace-nowrap"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusUpdate(appointment.id, "completed");
                                                    }}
                                                    disabled={isProcessing === appointment.id}
                                                >
                                                    {isProcessing === appointment.id ?
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> :
                                                        <Check className="h-4 w-4 mr-1" />
                                                    }
                                                    Concluir
                                                </Button>
                                            )}
                                            
                                            {/* Reschedule Client button for completed appointments */}                      
                                            {appointment.status.toLowerCase() === "completed" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-blue-200 py-1 px-2 h-auto whitespace-nowrap"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusUpdate(appointment.id, "confirmed");
                                                    }}
                                                    disabled={isProcessing === appointment.id}
                                                >
                                                    {isProcessing === appointment.id ?
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> :
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                    }
                                                    Reagendar
                                                </Button>
                                            )}
                                            
                                            {/* Reactivate button for cancelled appointments */}
                                            {(appointment.status.toLowerCase() === "cancelled" || 
                                              appointment.status.toLowerCase() === "no_show" ||
                                              appointment.status.toLowerCase() === "no-show" ||
                                              appointment.status.toLowerCase() === "noshow") && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-blue-200 py-1 px-2 h-auto whitespace-nowrap"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusUpdate(appointment.id, "confirmed");
                                                    }}
                                                    disabled={isProcessing === appointment.id}
                                                >
                                                    {isProcessing === appointment.id ?
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> :
                                                        <RefreshCw className="h-4 w-4 mr-1" />
                                                    }
                                                    Reativar
                                                </Button>
                                            )}
                                            
                                            {/* Reschedule button for pending/confirmed upcoming appointments */}                      
                                            {(appointment.status.toLowerCase() === "pending" || appointment.status.toLowerCase() === "confirmed") && 
                                             !hasAppointmentTimePassed(appointment) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 border-amber-200 py-1 px-2 h-auto whitespace-nowrap"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openRescheduleModal(appointment);
                                                    }}
                                                    disabled={isProcessing === appointment.id}
                                                >
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    Reagendar
                                                </Button>
                                            )}
                                            
                                            {/* Cancel button for pending/confirmed upcoming appointments */}                      
                                            {(appointment.status.toLowerCase() === "pending" || appointment.status.toLowerCase() === "confirmed") && 
                                             !hasAppointmentTimePassed(appointment) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200 py-1 px-2 h-auto whitespace-nowrap"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openCancelDialog(appointment);
                                                    }}
                                                    disabled={isProcessing === appointment.id}
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Cancelar
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {expandedAppointmentId === appointment.id && (
                                <div className="mt-3 pt-3 border-t">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center text-sm">
                                            <User className="h-4 w-4 mr-2 text-gray-500" />
                                            <span className="font-medium mr-1">Cliente:</span>
                                            <span>{appointment.user?.name || "Cliente"}</span>
                                        </div>

                                        {appointment.user?.phone && (
                                            <div className="flex items-center text-sm">
                                                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                                <span className="font-medium mr-1">Telefone:</span>
                                                <span>{appointment.user.phone}</span>
                                            </div>
                                        )}

                                        {appointment.user?.email && (
                                            <div className="flex items-center text-sm">
                                                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                                <span className="font-medium mr-1">Email:</span>
                                                <span>{appointment.user.email}</span>
                                            </div>
                                        )}

                                        {appointment.location && (
                                            <div className="flex items-center text-sm">
                                                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                                <span className="font-medium mr-1">Local:</span>
                                                <span>{appointment.location}</span>
                                            </div>
                                        )}

                                        {appointment.notes && (
                                            <div className="flex items-start text-sm">
                                                <span className="font-medium mr-1 mt-0.5">Observações:</span>
                                                <span className="text-gray-700">{appointment.notes}</span>
                                            </div>                                        )}                      
                                        {/* For past appointments in expanded view, only show attendance marking options */}
                                        {showActions && (appointment.status.toLowerCase() === "pending" || appointment.status.toLowerCase() === "confirmed") && 
                                         hasAppointmentTimePassed(appointment) && (
                                            <div className="flex flex-wrap gap-2 mt-2 mb-1">
                                                {/* Mark as Attended button */}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-purple-100 text-purple-800 hover:bg-purple-200 py-1 px-2 h-auto whitespace-nowrap"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusUpdate(appointment.id, "completed");
                                                    }}
                                                    disabled={isProcessing === appointment.id}
                                                >
                                                    {isProcessing === appointment.id ?
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> :
                                                        <Check className="h-4 w-4 mr-1" />
                                                    }
                                                    Atendido
                                                </Button>
                                                
                                                {/* No-Show button */}
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 py-1 px-2 h-auto whitespace-nowrap"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusUpdate(appointment.id, "no_show");
                                                    }}
                                                    disabled={isProcessing === appointment.id}
                                                >
                                                    {isProcessing === appointment.id ? 
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : 
                                                        <X className="h-4 w-4 mr-1" />
                                                    }
                                                    Não Compareceu
                                                </Button>
                                            </div>
                                        )}
                                        
                                        {/* For upcoming appointments in expanded view */}
                                        {showActions && (appointment.status.toLowerCase() === "pending" || appointment.status.toLowerCase() === "confirmed") && 
                                         !hasAppointmentTimePassed(appointment) && (
                                            <div className="flex flex-wrap gap-2 mt-2 mb-1">
                                                {appointment.status.toLowerCase() === "pending" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-green-100 text-green-800 hover:bg-green-200 py-1 px-2 h-auto whitespace-nowrap"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusUpdate(appointment.id, "confirmed");
                                                    }}
                                                    disabled={isProcessing === appointment.id}
                                                >
                                                    {isProcessing === appointment.id ?
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> :
                                                        <Check className="h-4 w-4 mr-1" />
                                                    }
                                                    Confirmar
                                                </Button>
                                            )}                                                {appointment.status.toLowerCase() === "confirmed" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800 py-1 px-2 h-auto whitespace-nowrap cursor-default"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Just prevent card expansion
                                                        }}
                                                        disabled={isProcessing === appointment.id}
                                                    >
                                                        {isProcessing === appointment.id ?
                                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" /> :
                                                            <Check className="h-4 w-4 mr-1" />
                                                        }
                                                        Confirmado
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 py-1 px-2 h-auto whitespace-nowrap"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openRescheduleModal(appointment);
                                                    }}
                                                    disabled={isProcessing === appointment.id}
                                                >
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    Reagendar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-red-100 text-red-800 hover:bg-red-200 py-1 px-2 h-auto whitespace-nowrap"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openCancelDialog(appointment);
                                                    }}
                                                    disabled={isProcessing === appointment.id}
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Cancelar
                                                </Button>
                                            </div>
                                        )}
                                        {showActions && (appointment.status.toLowerCase() === "in-progress" ||
                                            appointment.status.toLowerCase() === "inprogress" ||
                                            appointment.status.toLowerCase() === "in_progress") && (<Button
                                                variant="outline"
                                                size="sm"
                                                className="bg-purple-100 text-purple-800 hover:bg-purple-200 mt-2 py-1 px-2 h-auto whitespace-nowrap"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusUpdate(appointment.id, "completed");
                                                }}
                                                disabled={isProcessing === appointment.id}
                                            >
                                                {isProcessing === appointment.id ?
                                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" /> :
                                                    <Check className="h-4 w-4 mr-1" />
                                                }
                                                Concluir
                                            </Button>
                                            )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Reschedule Modal */}
            {rescheduleAppointment && (
                <ProfessionalRescheduleModal
                    appointment={rescheduleAppointment}
                    onComplete={handleRescheduleComplete}
                    onCancel={() => setRescheduleAppointment(null)}
                />
            )}

            {/* Cancel Confirmation Dialog */}
            <AlertDialog open={!!appointmentToCancel} onOpenChange={(open) => !open && setAppointmentToCancel(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
                            {appointmentToCancel?.user?.name && (
                                <p className="mt-2">
                                    <strong>Cliente:</strong> {appointmentToCancel.user.name}
                                </p>
                            )}
                            {appointmentToCancel && (
                                <p>
                                    <strong>Data:</strong> {format(new Date(appointmentToCancel.startTime), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                                </p>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Não, manter agendamento</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => {
                                if (appointmentToCancel) {
                                    handleStatusUpdate(appointmentToCancel.id, "cancelled");
                                    setAppointmentToCancel(null);
                                }
                            }}
                        >
                            {isProcessing === appointmentToCancel?.id ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processando
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Sim, cancelar
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProfessionalBookingsList;
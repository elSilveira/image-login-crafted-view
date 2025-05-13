import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, getEffectiveUserRole } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchProfessionalDetails, fetchServices } from "@/lib/api";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Image as ImageIcon, Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

// This page is deprecated. Publication creation is now handled as a modal in SocialFeed.
export default function NewPublication() {
  return null;
}

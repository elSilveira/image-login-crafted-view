import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfessionalProfileSettings from "../ProfessionalProfileSettings";
import * as api from "@/lib/api";
import { AuthContext } from "@/contexts/AuthContext";

// Mock Navigation and UserProfessionalInfo
jest.mock("@/components/Navigation", () => () => <div data-testid="navigation" />);
jest.mock("@/components/profile/UserProfessionalInfo", () => ({
  UserProfessionalInfo: ({ professionalId }: { professionalId?: string }) => (
    <div data-testid="user-professional-info">{professionalId ? `Editing ${professionalId}` : "Creating"}</div>
  ),
}));

// Mock API
const mockUser = { id: "user-1", name: "Test User" };
const mockProfessional = { id: "prof-1", name: "Prof User" };

jest.spyOn(api, "fetchProfessionals").mockImplementation(async (params) => {
  if (params.userId === mockUser.id) {
    return [mockProfessional];
  }
  return [];
});

jest.spyOn(api, "default").mockImplementation(() => ({
  get: async (url: string) => {
    if (url === "/users/me") {
      return { data: { ...mockUser, professionalProfileId: undefined } };
    }
    return { data: {} };
  },
}));

function renderWithAuthContext(ui: React.ReactElement, value: any) {
  return render(
    <AuthContext.Provider value={value}>{ui}</AuthContext.Provider>
  );
}

describe("ProfessionalProfileSettings", () => {
  it("shows creation form if user has no professionalProfileId but has a professional by userId", async () => {
    renderWithAuthContext(<ProfessionalProfileSettings />, {
      user: mockUser,
      accessToken: "token",
      isLoading: false,
    });
    // Wait for loading skeleton to disappear
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    // Should show editing form (because fallback finds professional)
    expect(await screen.findByText(/Editar Perfil Profissional/i)).toBeInTheDocument();
    expect(screen.getByTestId("user-professional-info")).toHaveTextContent("Editing prof-1");
  });

  it("shows creation form if user is not a professional", async () => {
    (api.fetchProfessionals as jest.Mock).mockResolvedValueOnce([]);
    renderWithAuthContext(<ProfessionalProfileSettings />, {
      user: mockUser,
      accessToken: "token",
      isLoading: false,
    });
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    expect(await screen.findByText(/Cadastro de Perfil Profissional/i)).toBeInTheDocument();
    expect(screen.getByTestId("user-professional-info")).toHaveTextContent("Creating");
  });

  it("shows fallback if user is not logged in", async () => {
    renderWithAuthContext(<ProfessionalProfileSettings />, {
      user: null,
      accessToken: null,
      isLoading: false,
    });
    expect(await screen.findByText(/Acesso Negado/i)).toBeInTheDocument();
  });
});

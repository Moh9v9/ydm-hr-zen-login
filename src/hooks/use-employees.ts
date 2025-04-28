
import { useQuery } from "@tanstack/react-query";

export interface Employee {
  employee_id: string;
  id_iqama_national: string;
  fullName: string;
  jobTitle: string;
  project: string;
  location: string;
  sponsorship: string;
  status: string;
}

const fetchEmployees = async (): Promise<Employee[]> => {
  console.log("Fetching employees data...");
  
  try {
    const response = await fetch("https://n8n.moh9v9.com/webhook/google-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entity: "employees",
        operation: "read",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch employees: ${response.status}`);
    }

    const data = await response.json();
    console.log("Employees data fetched successfully:", data.length || 0, "records");
    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
    retry: 1,
  });
};

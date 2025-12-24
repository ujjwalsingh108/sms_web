"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";

interface CredentialsDisplayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credentials: {
    email: string;
    password: string;
  };
  userType: string;
  userName?: string;
}

export function CredentialsDisplay({
  open,
  onOpenChange,
  credentials,
  userType,
  userName,
}: CredentialsDisplayProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownload = () => {
    const content = `Login Credentials
${userName ? `Name: ${userName}\n` : ""}User Type: ${userType}
Email: ${credentials.email}
Password: ${credentials.password}

Please save these credentials securely.
Generated on: ${new Date().toLocaleString()}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `credentials-${credentials.email.split("@")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Credentials downloaded");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            {userType} Created Successfully!
          </DialogTitle>
          <DialogDescription>
            Please save these credentials. The user can use these to login to
            their portal.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {userName && (
            <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
              <p className="text-sm font-medium text-blue-900">{userName}</p>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="flex gap-2">
              <input
                value={credentials.email}
                readOnly
                className="flex-1 px-3 py-2 text-sm border rounded-md bg-gray-50"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopy(credentials.email, "Email")}
              >
                {copiedField === "Email" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="flex gap-2">
              <input
                value={credentials.password}
                readOnly
                className="flex-1 px-3 py-2 text-sm border rounded-md bg-gray-50 font-mono"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopy(credentials.password, "Password")}
              >
                {copiedField === "Password" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> Make sure to save these credentials
              securely. You won't be able to see the password again.
            </p>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

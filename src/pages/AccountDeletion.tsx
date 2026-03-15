import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Mail, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AccountDeletion = () => {
  const [email, setEmail] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const isValidEmail = (value: string) => EMAIL_REGEX.test(value.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    if (!isValidEmail(trimmed)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirm(false);
    toast({
      title: "Deletion request sent",
      description:
        "Check your email for instructions to complete your account deletion.",
    });
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">VR</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Hevan Connect Travel
            </span>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-2">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Delete your account</CardTitle>
            <p className="text-gray-600">
              Enter the email address associated with your account. We&apos;ll send
              you instructions to complete the deletion.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                Request account deletion
              </Button>
            </form>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* <div className="mt-8 text-center">
          <img
            src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=150&fit=crop"
            alt="Heritage building"
            className="w-full h-32 object-cover rounded-xl opacity-80"
          />
        </div> */}
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will start the account deletion process. We&apos;ll send
              an email to <span className="font-medium">{email}</span> with
              instructions. Your account and data will be permanently removed
              once you complete the steps in that email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Yes, continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountDeletion;

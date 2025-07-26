import { getUserById, updateUser } from "@/api/users/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Save,
  User,
  Mail,
  Phone,
  Bookmark,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useEffect } from "react";
import { toast } from "sonner";

// Define validation schema
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  mobile_no: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  role: z.enum(["admin", "student", "staff"]),
  desc: z.string().optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const EditUser = () => {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = params;
  const userId = id ? String(id) : undefined;

  // Fetch user data
  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      userId !== undefined ? getUserById(userId) : Promise.reject("No user id"),
    enabled: userId !== undefined,
  });

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      mobile_no: "",
      role: "student",
      desc: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Update user mutation
  const { mutate: updateUserMutation, isPending } = useMutation({
    mutationFn: (data: FormValues) => {
      if (!userId) throw new Error("No user ID");
      return updateUser(userId, data);
    },
    onSuccess: () => {
      toast("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      navigate("/users");
    },
    onError: (error: Error) => {
      toast(error.message);
    },
  });

  // Set form default values when data is loaded
  useEffect(() => {
    if (userData) {
      const user = Array.isArray(userData) ? userData[0] : userData;
      form.reset({
        username: user.username,
        email: user.email,
        mobile_no: user.mobile_no,
        role: user.role as "admin" | "student" | "staff",
        desc: user.desc,
        password: "",
        confirmPassword: "",
      });
    }
  }, [userData, form]);

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = data;
    // Only include password if it was changed
    const updateData = userData.password 
      ? userData 
      : { ...userData, password: undefined };
    updateUserMutation(updateData);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );

  if (isError)
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        Error: {(error as Error).message}
      </div>
    );

  const user = Array.isArray(userData) ? userData[0] : userData;
  if (!user) return <div>User not found</div>;

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col gap-8">
        <div className="flex justify-end items-center">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>
                      <User className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-lg font-medium">{user?.username}</h3>
                    <Badge
                      variant={
                        user?.role === "admin" ? "destructive" : "default"
                      }
                      className="mt-1"
                    >
                      {user?.role}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Created At</Label>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(user?.createdAt), "PPpp")}
                    </div>
                  </div>
                  <div>
                    <Label>Last Updated</Label>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(user?.updatedAt), "PPpp")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Saved Courses ({user?.savedCourses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.savedCourses.length > 0 ? (
                  <div className="space-y-2">
                    {user?.savedCourses.map((courseId) => (
                      <div
                        key={courseId}
                        className="flex items-center gap-2 p-2 border rounded"
                      >
                        <Bookmark className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{courseId}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No saved courses
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Edit Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      {...form.register("username")}
                      maxLength={30}
                    />
                    {form.formState.errors.username && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                      />
                    </div>
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile_no">Mobile Number</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <Input
                        id="mobile_no"
                        maxLength={13}
                        {...form.register("mobile_no")}
                      />
                    </div>
                    {form.formState.errors.mobile_no && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.mobile_no.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      onValueChange={(value) =>
                        form.setValue("role", value as "admin" | "student" | "staff")
                      }
                      defaultValue={form.watch("role")}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.role && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.role.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    id="desc"
                    rows={3}
                    {...form.register("desc")}
                  />
                  {form.formState.errors.desc && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.desc.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Change Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    {...form.register("confirmPassword")}
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
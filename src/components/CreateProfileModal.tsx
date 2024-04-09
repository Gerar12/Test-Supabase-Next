"use client";

import { useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import CreateProfileContext from "@/context/CreateProfileContext";
import { Button } from "@/components/ui/button";
import { supabaseBrowserClient } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

const CreateProfileModal = () => {
  const route = useRouter();
  const {
    closeCreateProfileModal,
    isCreateProfileModalOpen,
    toggleCreateProfileModal,
  } = useContext(CreateProfileContext);

  const formSchema = z.object({
    image: z
      .instanceof(FileList)
      .refine((file) => file?.length == 1, "Image is required"),
    jobtitle: z
      .string()
      .min(2, { message: "Job title must be at least 2 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobtitle: "",
    },
  });

  const imageRef = form.register("image");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const unique_id = crypto.randomUUID();

    try {
      const imagenFile = values.image?.[0];
      const jobTitle = values.jobtitle;

      if (!imagenFile || !jobTitle) return;

      const {
        data: { session },
      } = await supabaseBrowserClient.auth.getSession();

      const uploadImagenPromise = await supabaseBrowserClient.storage
        .from("images")
        .upload(`user-${session?.user.id}-${unique_id}`, imagenFile, {
          cacheControl: "3600",
          upsert: false,
        });

      const [imageData] = await Promise.all([uploadImagenPromise]);
      const imagenError = imageData.error;

      if (imagenError) console.log(imagenError);

      const { error: updateError } = await supabaseBrowserClient
        .from("users")
        .update({
          logo: imageData.data?.path,
          job_title: jobTitle,
        })
        .eq("id", session?.user.id);

      if (updateError) console.log(updateError);

      form.reset();
      route.refresh();
      closeCreateProfileModal(false);
    } catch (error) {}
  }

  return (
    <Dialog
      open={isCreateProfileModalOpen}
      onOpenChange={toggleCreateProfileModal}
    >
      <DialogContent>
        <DialogTitle>Set your profile</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="jobtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job title</FormLabel>
                  <FormControl>
                    <Input placeholder="Job Title" {...field} />
                  </FormControl>
                  <FormDescription>Your Job Title</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      {...imageRef}
                      onChange={(event) => {
                        field.onChange(event.target?.files?.[0] ?? undefined);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Your logo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" variant="outline">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfileModal;

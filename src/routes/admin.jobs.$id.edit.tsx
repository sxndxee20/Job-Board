import { createFileRoute } from "@tanstack/react-router";
import { PostJobPage } from "./admin.jobs.new";

export const Route = createFileRoute("/admin/jobs/$id/edit")({
  head: () => ({
    meta: [{ title: "Edit Job — JobBoard Admin" }],
  }),
  component: () => <PostJobPage mode="edit" />,
});

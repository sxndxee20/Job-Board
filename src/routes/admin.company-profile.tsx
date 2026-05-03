import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Image, Palette, GripVertical, Plus, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/company-profile")({
  head: () => ({
    meta: [{ title: "Career Page Builder — JobBoard Admin" }],
  }),
  component: CompanyProfileBuilderPage,
});

function CompanyProfileBuilderPage() {
  return (
    <AdminLayout>
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Career Page Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">Design your public company profile to attract top talent.</p>
        </div>
        <button onClick={() => toast.success("Career page updated and published!")} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-glow hover:shadow-neon transition-all">
          <Save className="h-4 w-4" /> Publish Changes
        </button>
      </header>

      <div className="px-6 grid lg:grid-cols-3 gap-6 animate-slide-up">
        {/* Editor Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <h3 className="font-display font-bold mb-4 flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" /> Branding
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Primary Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-primary shadow-inner" />
                  <input type="text" value="#4F46E5" className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-mono" readOnly />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Cover Image</label>
                <button className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <Image className="h-4 w-4" /> Upload Hero Image
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <h3 className="font-display font-bold mb-4">Content Blocks</h3>
            <div className="space-y-2">
              <BlockDraggable title="About Us" type="Text" />
              <BlockDraggable title="Core Values" type="Grid" />
              <BlockDraggable title="Office Gallery" type="Carousel" />
              <button className="w-full mt-2 flex items-center justify-center gap-1 py-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                <Plus className="h-3 w-3" /> Add Custom Block
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2">
          <div className="rounded-t-xl bg-muted/30 border border-border border-b-0 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5"><div className="h-3 w-3 rounded-full bg-danger/50"/><div className="h-3 w-3 rounded-full bg-warning/50"/><div className="h-3 w-3 rounded-full bg-success/50"/></div>
            <span className="text-[10px] font-mono text-muted-foreground ml-2">Preview Mode (jobboard.com/c/technova)</span>
          </div>
          <div className="rounded-b-2xl border border-border bg-background shadow-2xl overflow-hidden h-[600px] overflow-y-auto pointer-events-none">
            {/* Mocked Career Page */}
            <div className="h-48 bg-primary/20 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <div className="px-8 relative -mt-12">
              <div className="h-24 w-24 rounded-2xl bg-primary text-white flex items-center justify-center text-4xl font-display font-black border-4 border-background shadow-lg mb-4">T</div>
              <h1 className="font-display text-3xl font-black text-foreground">TechNova Inc.</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">We're building the future of productivity tools for modern teams. Join us on our mission to make work feel less like work.</p>
              
              <div className="mt-8 pt-8 border-t border-border/50">
                 <h2 className="font-display text-xl font-bold mb-4">Core Values</h2>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-xl bg-surface border border-border">
                     <h4 className="font-bold">Ship Fast</h4>
                     <p className="text-sm text-muted-foreground mt-1">We believe in iterative development and getting things to users quickly.</p>
                   </div>
                   <div className="p-4 rounded-xl bg-surface border border-border">
                     <h4 className="font-bold">Empathy First</h4>
                     <p className="text-sm text-muted-foreground mt-1">We build for our users and treat our teammates with respect.</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function BlockDraggable({ title, type }: { title: string, type: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background cursor-grab hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-3">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">{type}</span>
    </div>
  )
}

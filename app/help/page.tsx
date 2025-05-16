import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Settings, Database, Workflow, Layers, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: "DASH Help Documentation",
  description: "User documentation and help resources for the DASH platform",
}

export default function HelpPage() {
  return (
    <div className="space-y-lg">
      <div className="mb-lg">
        <h1 className="text-3xl font-bold mb-2">DASH Help Documentation</h1>
        <p className="text-muted-foreground">
          Find help and documentation for using the DASH platform and its modules.
        </p>
      </div>

      <div className="relative mb-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search documentation..." className="pl-10" />
      </div>

      <Tabs defaultValue="modules">
        <TabsList className="mb-md">
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-lg">
          <section>
            <h2 className="text-2xl font-semibold mb-md">Core Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-600" />
                    <CardTitle className="text-lg">Forms</CardTitle>
                  </div>
                  <CardDescription>Create and manage digital forms and surveys</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    The Forms module allows you to create, edit, and manage digital forms and surveys. You can collect
                    data, create workflows, and analyze responses.
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Create custom forms with various field types</li>
                    <li>Distribute forms via links or embed codes</li>
                    <li>View and export form responses</li>
                    <li>Set up notifications for new submissions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-600" />
                    <CardTitle className="text-lg">Analytics</CardTitle>
                  </div>
                  <CardDescription>Data visualization and reporting tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    The Analytics module provides powerful data visualization and reporting tools to help you understand
                    your data and make informed decisions.
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Create custom dashboards and reports</li>
                    <li>Visualize data with charts and graphs</li>
                    <li>Schedule automated reports</li>
                    <li>Export data in various formats</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-md">Admin Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-slate-600" />
                    <CardTitle className="text-lg">System Settings</CardTitle>
                  </div>
                  <CardDescription>Configure system-wide settings, users, roles, and security</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    The System Settings module is a centralized hub for all administrative functions, including user
                    management, role management, security settings, and system configuration.
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Manage users and user accounts</li>
                    <li>Configure roles and permissions</li>
                    <li>Set up security policies and audit logs</li>
                    <li>Customize branding and system information</li>
                  </ul>
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-sm text-amber-800 font-medium">Recent Update</p>
                    <p className="text-xs text-amber-700 mt-1">
                      User Management and Security features have been integrated into the System Settings module for a
                      more streamlined administrative experience.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-slate-600" />
                    <CardTitle className="text-lg">Integrations</CardTitle>
                  </div>
                  <CardDescription>Connect with external services and APIs</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    The Integrations module allows you to connect DASH with external services, APIs, and data sources to
                    extend functionality and streamline workflows.
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Connect to third-party services</li>
                    <li>Set up data synchronization</li>
                    <li>Configure webhooks and callbacks</li>
                    <li>Manage API keys and authentication</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-md">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-slate-600" />
                    <CardTitle className="text-lg">Workflows</CardTitle>
                  </div>
                  <CardDescription>Automate business processes and approvals</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    The upcoming Workflows module will allow you to automate business processes, create approval
                    workflows, and streamline operations across your organization.
                  </p>
                  <div className="text-xs text-muted-foreground italic">Coming soon</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-slate-600" />
                    <CardTitle className="text-lg">Projects</CardTitle>
                  </div>
                  <CardDescription>Project management and collaboration</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    The upcoming Projects module will provide tools for project management, task tracking, and team
                    collaboration to help you manage work more effectively.
                  </p>
                  <div className="text-xs text-muted-foreground italic">Coming soon</div>
                </CardContent>
              </Card>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="getting-started">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with DASH</CardTitle>
              <CardDescription>Learn the basics of using the DASH platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-md">
              <section>
                <h3 className="text-lg font-medium mb-2">Dashboard Overview</h3>
                <p className="text-sm text-muted-foreground">
                  The DASH dashboard provides quick access to all available modules. You can favorite frequently used
                  modules for quicker access. Click on any module card to navigate to that module.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-medium mb-2">Navigation</h3>
                <p className="text-sm text-muted-foreground">
                  Use the sidebar navigation within each module to access different sections and features. You can
                  collapse the sidebar by clicking the arrow icon to gain more screen space.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-medium mb-2">User Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Access your user profile and settings by clicking on your profile picture in the top-right corner of
                  the screen. From there, you can update your profile information, change your password, and manage
                  notification preferences.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-medium mb-2">System Administration</h3>
                <p className="text-sm text-muted-foreground">
                  System administrators can access all administrative functions through the System Settings module. This
                  includes user management, role configuration, security settings, and system customization.
                </p>
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm text-amber-800 font-medium">Recent Update</p>
                  <p className="text-xs text-amber-700 mt-1">
                    User Management and Security features have been consolidated into the System Settings module. Access
                    these features by navigating to System Settings and using the sidebar navigation to select the
                    desired section.
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions and answers about using DASH</CardDescription>
            </CardHeader>
            <CardContent className="space-y-md">
              <div className="space-y-md">
                <div>
                  <h3 className="text-lg font-medium mb-1">How do I manage users and permissions?</h3>
                  <p className="text-sm text-muted-foreground">
                    User management and permissions are now handled through the System Settings module. Navigate to
                    System Settings and select "User Management" or "Role Management" from the sidebar to manage users
                    and their permissions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-1">Where can I find security settings?</h3>
                  <p className="text-sm text-muted-foreground">
                    Security settings have been integrated into the System Settings module. Access security features by
                    navigating to System Settings and selecting the appropriate security-related section from the
                    sidebar.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-1">How do I customize the platform branding?</h3>
                  <p className="text-sm text-muted-foreground">
                    Branding customization is available in the System Settings module. Navigate to System Settings and
                    select "Branding" from the sidebar to customize logos, colors, and other visual elements.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-1">Can I export data from DASH?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, most modules in DASH provide export functionality. Look for export buttons or options within
                    each module to export data in various formats such as CSV, Excel, or PDF.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-1">How do I get help if I encounter issues?</h3>
                  <p className="text-sm text-muted-foreground">
                    If you encounter any issues or have questions, you can contact your system administrator or reach
                    out to DASH support through the Help & Support section accessible from your user profile dropdown.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

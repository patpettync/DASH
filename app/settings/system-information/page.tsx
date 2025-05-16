"use client"

import { useState } from "react"
import { ModuleLayout } from "@/components/layouts/module-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InfoCard } from "@/components/ui-core/info-card"
import { settingsTabs } from "@/lib/settings-tabs"

export default function SystemInformationPage() {
  const [activeTab, setActiveTab] = useState("system")

  return (
    <ModuleLayout moduleName="System Settings" tabs={settingsTabs} basePath="/settings">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Overview of your system configuration and status.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard
                    title="System Version"
                    value="v2.5.0"
                    description="Last updated: 2 weeks ago"
                    badge={{ label: "Latest", variant: "success" }}
                  />
                  <InfoCard
                    title="Environment"
                    value="Production"
                    description="Running on secure servers"
                    badge={{ label: "Stable", variant: "success" }}
                  />
                  <InfoCard
                    title="Database"
                    value="PostgreSQL 14.5"
                    description="Connection pool: 25/50"
                    badge={{ label: "Healthy", variant: "success" }}
                  />
                  <InfoCard
                    title="Storage"
                    value="345.8 GB / 500 GB"
                    description="69.2% used"
                    badge={{ label: "Sufficient", variant: "warning" }}
                  />
                  <InfoCard
                    title="Cache"
                    value="Redis 7.0.5"
                    description="Hit ratio: 94.2%"
                    badge={{ label: "Optimal", variant: "success" }}
                  />
                  <InfoCard
                    title="Last Backup"
                    value="Today, 03:15 AM"
                    description="Automatic daily backup"
                    badge={{ label: "Recent", variant: "success" }}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-medium">System Health</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">CPU Usage</span>
                      <span className="text-sm font-medium">24%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill bg-green-500" style={{ width: "24%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Memory Usage</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill bg-green-500" style={{ width: "42%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Disk I/O</span>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill bg-green-500" style={{ width: "18%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Network</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill bg-green-500" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>System performance over time.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-slate-100 rounded-md">
                  <p className="text-muted-foreground">Performance charts will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Recent system events and errors.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-slate-100 rounded-md">
                  <p className="text-muted-foreground">System logs will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  )
}

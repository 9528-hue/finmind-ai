"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Bot,
  BrainCircuit,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Download,
  FileCheck2,
  FileClock,
  FileInput,
  Filter,
  Gauge,
  Landmark,
  MoreHorizontal,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Upload,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const chartTooltip = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
    fontSize: 12,
  },
};

const cashFlow = [
  { month: "Jun", inflow: 142, outflow: 96, balance: 284 },
  { month: "Jul", inflow: 156, outflow: 103, balance: 337 },
  { month: "Aug", inflow: 168, outflow: 108, balance: 397 },
  { month: "Sep", inflow: 182, outflow: 116, balance: 463 },
  { month: "Oct", inflow: 194, outflow: 121, balance: 536 },
  { month: "Nov", inflow: 208, outflow: 132, balance: 612 },
  { month: "Dec", inflow: 224, outflow: 145, balance: 691 },
  { month: "Jan", inflow: 238, outflow: 151, balance: 778 },
  { month: "Feb", inflow: 247, outflow: 158, balance: 867 },
  { month: "Mar", inflow: 259, outflow: 164, balance: 962 },
];

const forecastData = [
  { month: "Oct", base: 536, upside: 536, downside: 536 },
  { month: "Nov", base: 612, upside: 630, downside: 585 },
  { month: "Dec", base: 691, upside: 735, downside: 638 },
  { month: "Jan", base: 778, upside: 842, downside: 696 },
  { month: "Feb", base: 867, upside: 956, downside: 754 },
  { month: "Mar", base: 962, upside: 1082, downside: 818 },
];

const spendData = [
  { name: "People", value: 42, color: "#0f766e" },
  { name: "Operations", value: 26, color: "#14b8a6" },
  { name: "Marketing", value: 18, color: "#f59e0b" },
  { name: "Technology", value: 14, color: "#cbd5e1" },
];

const invoices = [
  { id: "INV-2024-0918", vendor: "Northstar Cloud Services", date: "Sep 22, 2024", amount: "$18,450.00", status: "Needs review", confidence: "98%", flag: "Duplicate risk" },
  { id: "INV-2024-0917", vendor: "Mosaic Creative Studio", date: "Sep 21, 2024", amount: "$7,840.00", status: "Approved", confidence: "99%", flag: "Matched PO" },
  { id: "INV-2024-0916", vendor: "Vertex Office Supply", date: "Sep 20, 2024", amount: "$2,184.50", status: "Processing", confidence: "97%", flag: "New vendor" },
  { id: "INV-2024-0915", vendor: "Cloudline Logistics", date: "Sep 18, 2024", amount: "$12,600.00", status: "Approved", confidence: "99%", flag: "Matched PO" },
  { id: "INV-2024-0914", vendor: "Northstar Cloud Services", date: "Sep 16, 2024", amount: "$18,450.00", status: "Blocked", confidence: "100%", flag: "Exact duplicate" },
];

const anomalies = [
  { title: "Potential duplicate invoice", detail: "Northstar Cloud Services · $18,450", severity: "High", time: "12 min ago", icon: FileCheck2 },
  { title: "Unusual payment timing", detail: "3 payments made outside approval window", severity: "Medium", time: "48 min ago", icon: Clock3 },
  { title: "Vendor bank detail changed", detail: "Mosaic Creative Studio · verification pending", severity: "Medium", time: "2 hrs ago", icon: ShieldAlert },
];

type ChatMessage = { role: "user" | "assistant"; text: string };

function MetricCard({
  label,
  value,
  change,
  positive = true,
  icon: Icon,
  accent = "teal",
}: {
  label: string;
  value: string;
  change: string;
  positive?: boolean;
  icon: typeof Activity;
  accent?: "teal" | "amber" | "blue" | "slate";
}) {
  const accents = {
    teal: "bg-teal-50 text-teal-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-sky-50 text-sky-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return (
    <Card className="border-0 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
          </div>
          <div className={`rounded-xl p-2.5 ${accents[accent]}`}><Icon className="size-4" /></div>
        </div>
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${positive ? "text-teal-700" : "text-rose-600"}`}>
          {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {change}
          <span className="ml-1 font-normal text-slate-400">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">{eyebrow}</p>}
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [dateRange, setDateRange] = useState("This month");
  const [scenario, setScenario] = useState("Base case");
  const [invoiceFilter, setInvoiceFilter] = useState("All invoices");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Good morning, Alex. I’ve reviewed your latest ledger sync. What would you like to explore?" },
  ]);

  const filteredInvoices = useMemo(
    () => invoiceFilter === "All invoices" ? invoices : invoices.filter((invoice) => invoice.status === invoiceFilter),
    [invoiceFilter],
  );

  const sendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setChatMessages((messages) => [
      ...messages,
      { role: "user", text: trimmed },
      { role: "assistant", text: trimmed.toLowerCase().includes("runway") ? "At the current burn rate, runway is 8.4 months. The base-case forecast reaches $962k in cash by March, with a 14% downside buffer." : "I found a few relevant signals: accounts receivable is 6 days faster this month, while software spend is 8% above plan. I can build a recommendation if you’d like." },
    ]);
    setChatInput("");
  };

  return (
    <main className="min-h-screen bg-[#f7f9fb] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[244px] border-r border-slate-200 bg-white px-4 py-5 lg:flex lg:flex-col">
        <div className="flex items-center gap-3 px-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm"><BrainCircuit className="size-5" /></div>
          <div><p className="text-[15px] font-bold tracking-tight text-slate-950">FinMind <span className="text-teal-600">AI</span></p><p className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400">Intelligent finance</p></div>
        </div>
        <div className="mt-9 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Workspace</div>
        <nav className="mt-2 space-y-1">
          {[
            { label: "Overview", icon: Gauge },
            { label: "Invoices", icon: FileInput, count: "24" },
            { label: "Cash flow", icon: TrendingUp },
            { label: "Budgets", icon: WalletCards },
            { label: "Anomalies", icon: ShieldAlert, count: "3" },
          ].map(({ label, icon: Icon, count }) => (
            <button key={label} onClick={() => setActiveNav(label)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${activeNav === label ? "bg-teal-50 font-semibold text-teal-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
              <span className="flex items-center gap-3"><Icon className="size-4" />{label}</span>
              {count && <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${activeNav === label ? "bg-white text-teal-700" : "bg-slate-100 text-slate-500"}`}>{count}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-8 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Manage</div>
        <nav className="mt-2 space-y-1">
          <button onClick={() => setActiveNav("Team")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"><Building2 className="size-4" />Team & entities</button>
          <button onClick={() => setActiveNav("Settings")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"><Settings2 className="size-4" />Settings</button>
        </nav>
        <div className="mt-auto rounded-xl bg-slate-950 p-4 text-white">
          <Sparkles className="mb-3 size-4 text-teal-300" />
          <p className="text-sm font-semibold">Ask FinMind anything</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Get answers from your connected financial data.</p>
          <Button onClick={() => document.getElementById("decision-chat")?.scrollIntoView({ behavior: "smooth" })} size="sm" className="mt-3 w-full bg-teal-500 text-slate-950 hover:bg-teal-400">Open assistant</Button>
        </div>
      </aside>

      <div className="lg:pl-[244px]">
        <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-slate-200 bg-[#f7f9fb]/90 px-5 backdrop-blur-md sm:px-8">
          <div>
            <p className="text-xs font-medium text-slate-400">Monday, September 23, 2024</p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-950">Good morning, Alex <span aria-hidden="true">👋</span></h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 sm:flex"><span className="size-2 rounded-full bg-teal-500" />All systems operational</div>
            <Button variant="outline" size="icon" onClick={() => setNotificationOpen(true)} className="relative bg-white"><Bell className="size-4" /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-rose-500" /></Button>
            <div className="ml-1 flex size-8 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">AS</div>
          </div>
        </header>

        <div className="mx-auto max-w-[1450px] space-y-8 px-5 py-7 sm:px-8">
          {activeNav !== "Overview" && <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900"><span className="font-semibold">{activeNav}</span> view selected. The overview below remains your command center — use the linked cards to work with this dataset.</div>}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Executive overview</p><h2 className="text-2xl font-semibold tracking-tight text-slate-950">Your business at a glance</h2><p className="mt-1 text-sm text-slate-500">AI-powered insights across your financial operations.</p></div>
            <div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => setDateRange(dateRange === "This month" ? "Last 90 days" : "This month")} className="bg-white"><CalendarDays className="size-3.5" />{dateRange}<ChevronDown className="size-3.5" /></Button><Button size="sm" onClick={() => setUploadOpen(true)} className="bg-slate-950 text-white hover:bg-slate-800"><Plus className="size-3.5" />Add data</Button></div>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Cash position" value="$463,280" change="12.4%" icon={CircleDollarSign} accent="teal" />
            <MetricCard label="Monthly revenue" value="$182,640" change="8.7%" icon={TrendingUp} accent="blue" />
            <MetricCard label="Operating burn" value="$116,240" change="3.1%" positive={false} icon={Activity} accent="amber" />
            <MetricCard label="Runway" value="8.4 months" change="0.6 mo" icon={Landmark} accent="slate" />
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
            <Card className="border-0 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <CardHeader className="flex-row items-start justify-between">
                <div><CardTitle>Cash flow performance</CardTitle><CardDescription>Actual inflow and outflow, USD thousands</CardDescription></div>
                <Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
              </CardHeader>
              <CardContent className="h-[280px] px-2 pb-4 sm:px-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlow} margin={{ top: 12, right: 10, left: -20, bottom: 0 }}>
                    <defs><linearGradient id="inflow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14b8a6" stopOpacity={0.22} /><stop offset="100%" stopColor="#14b8a6" stopOpacity={0} /></linearGradient><linearGradient id="outflow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity={0.16} /><stop offset="100%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid vertical={false} stroke="#eef2f6" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} /><Tooltip {...chartTooltip} /><Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Area type="monotone" dataKey="inflow" name="Inflow" stroke="#0f766e" strokeWidth={2.5} fill="url(#inflow)" /><Area type="monotone" dataKey="outflow" name="Outflow" stroke="#f59e0b" strokeWidth={2} fill="url(#outflow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <CardHeader><CardTitle>Spend allocation</CardTitle><CardDescription>Current month by cost center</CardDescription></CardHeader>
              <CardContent className="flex items-center gap-4 pb-5">
                <div className="h-[165px] w-[165px] shrink-0"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={spendData} dataKey="value" innerRadius={52} outerRadius={75} paddingAngle={3} stroke="none">{spendData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip {...chartTooltip} /></PieChart></ResponsiveContainer></div>
                <div className="w-full space-y-3">{spendData.map((item) => <div key={item.name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-slate-600"><span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span><span className="font-semibold text-slate-900">{item.value}%</span></div>)}</div>
              </CardContent>
            </Card>
          </section>

          <section>
            <SectionHeading eyebrow="Action center" title="Signals worth your attention" description="FinMind found these opportunities and risks in your latest sync." action={<Button variant="ghost" size="sm" className="text-teal-700"><RefreshCw className="size-3.5" />Refresh</Button>} />
            <div className="grid gap-4 md:grid-cols-3">{anomalies.map((item) => { const Icon = item.icon; return <Card key={item.title} className="border-0 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"><CardContent className="p-4"><div className="flex items-start justify-between"><div className="rounded-lg bg-rose-50 p-2 text-rose-600"><Icon className="size-4" /></div><Badge variant={item.severity === "High" ? "destructive" : "outline"}>{item.severity}</Badge></div><p className="mt-4 text-sm font-semibold text-slate-900">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.detail}</p><div className="mt-4 flex items-center justify-between text-[11px] text-slate-400"><span>{item.time}</span><button className="font-semibold text-teal-700 hover:text-teal-900">Review →</button></div></CardContent></Card>; })}</div>
          </section>

          <section>
            <SectionHeading eyebrow="Invoice intelligence" title="Extract, verify, and approve" description="OCR and duplicate detection are monitoring every invoice." action={<Button size="sm" onClick={() => setUploadOpen(true)} className="bg-teal-700 text-white hover:bg-teal-800"><Upload className="size-3.5" />Upload invoice</Button>} />
            <Card className="border-0 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <CardContent className="p-0">
                <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><Search className="size-4 text-slate-400" /><Input className="h-8 w-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 sm:w-56" placeholder="Search invoices..." /></div><div className="flex items-center gap-2"><Filter className="size-3.5 text-slate-400" /><select value={invoiceFilter} onChange={(event) => setInvoiceFilter(event.target.value)} className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none"><option>All invoices</option><option>Needs review</option><option>Approved</option><option>Processing</option><option>Blocked</option></select><Button variant="outline" size="sm" className="hidden sm:flex"><Download className="size-3.5" />Export</Button></div></div>
                <Table><TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Vendor</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>AI status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{filteredInvoices.map((invoice) => <TableRow key={invoice.id}><TableCell><div className="font-medium text-slate-900">{invoice.id}</div><div className="text-[11px] text-slate-400">{invoice.flag}</div></TableCell><TableCell>{invoice.vendor}</TableCell><TableCell className="text-slate-500">{invoice.date}</TableCell><TableCell className="font-medium">{invoice.amount}</TableCell><TableCell><div className="flex items-center gap-2"><Badge variant={invoice.status === "Approved" ? "secondary" : invoice.status === "Blocked" ? "destructive" : "outline"}>{invoice.status}</Badge><span className="text-[11px] text-slate-400">{invoice.confidence}</span></div></TableCell><TableCell className="text-right"><Button variant="ghost" size="sm">{invoice.status === "Approved" ? "View" : "Review"}</Button></TableCell></TableRow>)}</TableBody></Table>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
            <Card className="border-0 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <CardHeader className="flex-row items-start justify-between"><div><CardTitle>90-day cash forecast</CardTitle><CardDescription>Projected cash balance with AI confidence ranges</CardDescription></div><select value={scenario} onChange={(event) => setScenario(event.target.value)} className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none"><option>Base case</option><option>Upside case</option><option>Downside case</option></select></CardHeader>
              <CardContent className="h-[290px] px-2 pb-5 sm:px-4"><ResponsiveContainer width="100%" height="100%"><AreaChart data={forecastData} margin={{ top: 12, right: 10, left: -20, bottom: 0 }}><defs><linearGradient id="forecast" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f766e" stopOpacity={0.2} /><stop offset="100%" stopColor="#0f766e" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#eef2f6" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} /><Tooltip {...chartTooltip} /><Area type="monotone" dataKey="base" name="Base projection" stroke="#0f766e" strokeWidth={2.5} fill="url(#forecast)" /><Area type="monotone" dataKey="upside" name="Upside" stroke="#94a3b8" strokeDasharray="4 4" fill="none" /><Area type="monotone" dataKey="downside" name="Downside" stroke="#f59e0b" strokeDasharray="4 4" fill="none" /></AreaChart></ResponsiveContainer></CardContent>
              <div className="mx-4 mb-4 flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-xs text-teal-800"><Sparkles className="size-3.5 shrink-0" /><span><span className="font-semibold">AI insight:</span> Collections velocity is improving. You have a 92% chance of staying above your $400k cash floor.</span></div>
            </Card>
            <Card className="border-0 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"><CardHeader className="flex-row items-start justify-between"><div><CardTitle>Budget optimization</CardTitle><CardDescription>Potential savings found this cycle</CardDescription></div><Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">$24.8k found</Badge></CardHeader><CardContent className="space-y-4">{[{ name: "Software consolidation", amount: "$12,400", detail: "3 overlapping tools", color: "bg-teal-500" }, { name: "Vendor term negotiation", amount: "$8,200", detail: "5 contracts eligible", color: "bg-amber-500" }, { name: "Unused subscriptions", amount: "$4,200", detail: "8 seats inactive", color: "bg-sky-500" }].map((item) => <div key={item.name} className="flex items-center gap-3"><div className={`size-2 rounded-full ${item.color}`} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-800">{item.name}</p><p className="text-xs text-slate-400">{item.detail}</p></div><div className="text-right"><p className="text-sm font-semibold text-slate-900">{item.amount}</p><button className="text-[11px] font-medium text-teal-700">Explore</button></div></div>)}<Button variant="outline" className="mt-2 w-full">Open optimization engine <ArrowUpRight className="size-3.5" /></Button></CardContent></Card>
          </section>

          <section id="decision-chat" className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <Card className="overflow-hidden border-0 bg-slate-950 text-white shadow-[0_12px_40px_rgba(15,23,42,0.15)]"><CardHeader className="border-b border-white/10"><div className="flex items-center gap-3"><div className="rounded-xl bg-teal-500/20 p-2 text-teal-300"><Bot className="size-5" /></div><div><CardTitle className="text-white">FinMind decision assistant</CardTitle><CardDescription className="text-slate-400">Ask questions, model scenarios, and turn insight into action.</CardDescription></div><Badge className="ml-auto bg-teal-500/15 text-teal-300 hover:bg-teal-500/15"><span className="mr-1.5 size-1.5 rounded-full bg-teal-400" />Live</Badge></div></CardHeader><CardContent className="flex min-h-[310px] flex-col p-0"><div className="flex-1 space-y-4 overflow-auto p-5">{chatMessages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>{message.role === "assistant" && <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300"><Sparkles className="size-3.5" /></div>}<div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${message.role === "user" ? "bg-teal-600 text-white" : "bg-white/10 text-slate-200"}`}>{message.text}</div></div>)}</div><div className="border-t border-white/10 p-4"><div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5"><Paperclip className="size-4 text-slate-500" /><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendMessage()} placeholder="Ask about your cash flow, spend, or risk..." className="h-8 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500" /><button onClick={sendMessage} className="rounded-lg bg-teal-500 p-2 text-slate-950 transition hover:bg-teal-400"><Send className="size-3.5" /></button></div><div className="mt-2 flex flex-wrap gap-2">{["What is my runway?", "Where can I save?", "Show anomalies"].map((prompt) => <button key={prompt} onClick={() => { setChatInput(prompt); }} className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-slate-400 hover:border-teal-500/50 hover:text-teal-300">{prompt}</button>)}</div></div></CardContent></Card>
            <Card className="border-0 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"><CardHeader><CardTitle>Data health</CardTitle><CardDescription>Connected sources and sync status</CardDescription></CardHeader><CardContent className="space-y-4">{[{ label: "Ledger & transactions", detail: "Synced 4 min ago", icon: Landmark }, { label: "Accounts payable", detail: "Synced 12 min ago", icon: FileClock }, { label: "Bank accounts", detail: "Synced 18 min ago", icon: CircleDollarSign }].map(({ label, detail, icon: Icon }) => <div key={label} className="flex items-center gap-3"><div className="rounded-lg bg-slate-100 p-2 text-slate-600"><Icon className="size-4" /></div><div className="flex-1"><p className="text-sm font-medium text-slate-800">{label}</p><p className="text-xs text-slate-400">{detail}</p></div><Check className="size-4 text-teal-600" /></div>)}<div className="mt-2 rounded-xl border border-dashed border-slate-200 p-3 text-center"><p className="text-xs text-slate-500">Need another integration?</p><button className="mt-1 text-xs font-semibold text-teal-700">Connect a source →</button></div></CardContent></Card>
          </section>
        </div>
      </div>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Upload financial data</DialogTitle><DialogDescription>Drop an invoice, bank statement, or expense export. FinMind will extract and validate it automatically.</DialogDescription></DialogHeader><div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center"><div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700"><Upload className="size-5" /></div><p className="mt-3 text-sm font-medium text-slate-800">Choose a file to analyze</p><p className="mt-1 text-xs text-slate-500">PDF, CSV, XLSX up to 25 MB</p><Button onClick={() => setUploadOpen(false)} className="mt-4 bg-slate-950">Select file</Button></div><DialogFooter><Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}><DialogContent><DialogHeader><DialogTitle>Notifications</DialogTitle><DialogDescription>Three items need your attention.</DialogDescription></DialogHeader><div className="space-y-3">{anomalies.map((item) => <div key={item.title} className="flex gap-3 rounded-lg bg-slate-50 p-3"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" /><div><p className="text-sm font-medium">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.time}</p></div></div>)}</div><DialogFooter><Button onClick={() => setNotificationOpen(false)}>Done</Button></DialogFooter></DialogContent></Dialog>
    </main>
  );
}

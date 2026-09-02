"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  ArrowUpRight,
  Bot,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Database,
  Download,
  FileText,
  GitBranch,
  Headphones,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Phone,
  PhoneCall,
  RefreshCw,
  Search,
  Sparkles,
  Square,
  UserRoundCheck,
  Users,
  Volume2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type MerchantStatus =
  | "Call scheduled"
  | "Interested"
  | "Transferred"
  | "Callback booked"
  | "WhatsApp sent"
  | "Retry 2 of 3"

type Merchant = {
  id: string
  name: string
  city: string
  contact: string
  terminal: string
  status: MerchantStatus
  nextAction: string
  time: string
  score: number
  note: string
  insight: string
}

const merchants: Merchant[] = [
  {
    id: "WL-20481",
    name: "Bakkerij De Korenaar",
    city: "Antwerpen",
    contact: "Sofie De Smet",
    terminal: "Yomani XR",
    status: "Call scheduled",
    nextAction: "Dutch AI call",
    time: "Today, 14:30",
    score: 92,
    note: "Prefers concise calls after the lunch rush. Positive tone in previous support contacts.",
    insight: "Family bakery with two checkout points and high morning debit-card volume.",
  },
  {
    id: "WL-20482",
    name: "Brasserie Noord",
    city: "Gent",
    contact: "Jeroen Peeters",
    terminal: "Yoximo",
    status: "Interested",
    nextAction: "Warm transfer",
    time: "Ready now",
    score: 97,
    note: "Asked for a mobile option during the last contract review.",
    insight: "Terrace service makes a portable terminal the strongest replacement fit.",
  },
  {
    id: "WL-20483",
    name: "Studio Bloem",
    city: "Leuven",
    contact: "An Vermeulen",
    terminal: "VX 680",
    status: "WhatsApp sent",
    nextAction: "Await response",
    time: "Call at 16:10",
    score: 78,
    note: "Rarely opens operational email; usually responds to mobile messages.",
    insight: "Owner-operated florist. A simple countertop replacement is recommended.",
  },
  {
    id: "WL-20484",
    name: "Fietsatelier Velo",
    city: "Mechelen",
    contact: "Bram Jacobs",
    terminal: "Lane/3000",
    status: "Callback booked",
    nextAction: "Human callback",
    time: "Tomorrow, 10:00",
    score: 85,
    note: "Technically confident; prefers detailed product comparisons by email.",
    insight: "Growing repair shop with a new online reservation flow planned this quarter.",
  },
  {
    id: "WL-20485",
    name: "Apotheek Sint-Jan",
    city: "Brugge",
    contact: "Liesbeth Maes",
    terminal: "Yomani XR",
    status: "Transferred",
    nextAction: "Sales follow-up",
    time: "Completed 11:42",
    score: 94,
    note: "Values continuity and clear installation planning; avoid peak hours.",
    insight: "Payment continuity is critical. Free on-site installation is the key message.",
  },
  {
    id: "WL-20486",
    name: "Café De Markt",
    city: "Hasselt",
    contact: "Tom Willems",
    terminal: "VX 680",
    status: "Retry 2 of 3",
    nextAction: "Send prep email",
    time: "Tomorrow, 09:20",
    score: 68,
    note: "Two unanswered calls. Contact window is before opening or mid-afternoon.",
    insight: "Small hospitality merchant; lead with urgency and minimal operational disruption.",
  },
]

const logEntries = [
  ["11:42", "Apotheek Sint-Jan", "AI call", "Warm transfer completed", "Success"],
  ["11:34", "Brasserie Noord", "AI call", "Purchase interest detected", "Qualified"],
  ["11:18", "Studio Bloem", "WhatsApp", "Reminder delivered", "Delivered"],
  ["10:52", "Fietsatelier Velo", "Calendar", "Human callback booked", "Scheduled"],
  ["10:31", "Café De Markt", "AI call", "No answer · retry 2 created", "Retry"],
  ["09:47", "Bakkerij De Korenaar", "Email", "Preparation email opened", "Opened"],
]

const statusStyles: Record<MerchantStatus, string> = {
  "Call scheduled": "border-sky-200 bg-sky-50 text-sky-700",
  Interested: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Transferred: "border-[#a9ddd4] bg-[#e7f7f4] text-[#2f8277]",
  "Callback booked": "border-violet-200 bg-violet-50 text-violet-700",
  "WhatsApp sent": "border-amber-200 bg-amber-50 text-amber-700",
  "Retry 2 of 3": "border-rose-200 bg-rose-50 text-rose-700",
}

function StatusPill({ status }: { status: MerchantStatus }) {
  return (
    <Badge variant="outline" className={statusStyles[status]}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  )
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string
  value: string
  detail: string
  icon: typeof Users
}) {
  return (
    <article className="metric-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#61706d]">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#142d2a]">{value}</p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-xl bg-[#e5f6f2] text-[#2f8277]">
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-3 text-sm text-[#7a8986]">{detail}</p>
    </article>
  )
}

function FlowNode({
  icon: Icon,
  label,
  title,
  detail,
  items,
  imageSrc,
  imageAlt,
  cropLogo = false,
  tone = "native",
}: {
  icon: typeof Users
  label: string
  title: string
  detail?: string
  items?: string[]
  imageSrc?: string
  imageAlt?: string
  cropLogo?: boolean
  tone?: "native" | "external" | "decision" | "success" | "human"
}) {
  return (
    <div className="flow-node" data-tone={tone}>
      <span
        className="flow-node-icon"
        data-logo={imageSrc ? "true" : undefined}
        data-logo-crop={cropLogo ? "true" : undefined}
      >
        {imageSrc ? <img src={imageSrc} alt={imageAlt ?? ""} /> : <Icon />}
      </span>
      <div>
        <span className="flow-node-label">{label}</span>
        <strong>{title}</strong>
        {detail && <p>{detail}</p>}
        {items && (
          <ul className="flow-node-list">
            {items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant>(merchants[0])
  const [sheetOpen, setSheetOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [scenario, setScenario] = useState<"objection" | "interested" | "callback">("objection")
  const [transferred, setTransferred] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioUnsupported, setAudioUnsupported] = useState(false)

  const filteredMerchants = useMemo(() => {
    return merchants.filter((merchant) => {
      const matchesQuery = `${merchant.name} ${merchant.contact} ${merchant.city}`
        .toLowerCase()
        .includes(query.toLowerCase())
      const matchesStatus = statusFilter === "all" || merchant.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [query, statusFilter])

  const response = {
    objection: {
      merchant: "Mijn huidige toestel werkt nog prima. Waarom moet ik het nu al vervangen?",
      merchantEnglish: "My current terminal still works perfectly. Why do I need to replace it already?",
      bot: "Dat begrijp ik. Uw Yomani XR ontvangt binnenkort geen software-updates meer en kan daardoor uiteindelijk geen betalingen meer verwerken. Mag ik kort bekijken welk nieuw toestel het best bij uw zaak past?",
      botEnglish: "I understand. Your Yomani XR will soon stop receiving software updates and may eventually be unable to process payments. May I briefly check which new terminal best suits your business?",
      intent: "EOS objection",
      confidence: "96%",
      action: "Explain urgency",
    },
    interested: {
      merchant: "Ja, ik wil graag weten welk nieuw toestel u aanbeveelt.",
      merchantEnglish: "Yes, I would like to know which new terminal you recommend.",
      bot: "Prima. U gebruikt momenteel twee vaste kassa’s en verwerkt vooral Bancontact. Ik stel u drie korte vragen en verbind u daarna met een adviseur.",
      botEnglish: "Great. You currently use two fixed checkouts and mainly process Bancontact payments. I will ask three short questions and then connect you with an advisor.",
      intent: "Continue sales",
      confidence: "98%",
      action: "Qualify & transfer",
    },
    callback: {
      merchant: "Ik heb nu geen tijd. Kan iemand mij morgen in de voormiddag bellen?",
      merchantEnglish: "I do not have time now. Can someone call me tomorrow morning?",
      bot: "Natuurlijk. Ik plan een gesprek met een adviseur voor morgen om 10 uur. U ontvangt meteen een bevestiging per e-mail.",
      botEnglish: "Of course. I will schedule a call with an advisor for tomorrow at 10 a.m. You will receive an email confirmation immediately.",
      intent: "Human callback",
      confidence: "99%",
      action: "Book 10:00 slot",
    },
  }[scenario]

  const callScript = [
    { role: "bot", text: "Goedemiddag, u spreekt met Noor, de digitale assistent van Worldline. Spreek ik met mevrouw De Smet?" },
    { role: "merchant", text: "Ja, dat klopt." },
    { role: "bot", text: "Heeft u onze e-mail over de vervanging van uw betaalterminal ontvangen?" },
    { role: "merchant", text: response.merchant },
    { role: "bot", text: response.bot },
  ]

  const stopCallAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }

  const playCallAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setAudioUnsupported(true)
      return
    }

    window.speechSynthesis.cancel()
    setAudioUnsupported(false)
    const voices = window.speechSynthesis.getVoices()
    const dutchVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("nl"))
    const belgianVoice = dutchVoices.find((voice) => voice.lang.toLowerCase() === "nl-be")
    const botVoice = belgianVoice ?? dutchVoices[0]
    const merchantVoice = dutchVoices.find((voice) => voice !== botVoice) ?? botVoice

    callScript.forEach((line, index) => {
      const utterance = new SpeechSynthesisUtterance(line.text)
      utterance.lang = "nl-BE"
      utterance.voice = line.role === "bot" ? botVoice ?? null : merchantVoice ?? null
      utterance.rate = line.role === "bot" ? 0.93 : 0.97
      utterance.pitch = line.role === "bot" ? 1.02 : 0.94
      if (index === callScript.length - 1) {
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
      }
      window.speechSynthesis.speak(utterance)
    })
    setIsSpeaking(true)
  }

  const changeScenario = (nextScenario: "objection" | "interested" | "callback") => {
    stopCallAudio()
    setScenario(nextScenario)
    setTransferred(false)
  }

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const openMerchant = (merchant: Merchant) => {
    setSelectedMerchant(merchant)
    setSheetOpen(true)
  }

  return (
    <Tabs defaultValue="call" orientation="vertical" className="app-shell">
      <aside className="sidebar-shell">
        <div className="brand-lockup">
          <img src="/worldline-logo.png" alt="Worldline" className="worldline-logo" />
        </div>

        <div className="mt-9 hidden px-3 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Campaign workspace</p>
          <p className="mt-2 text-sm font-medium text-white/90">YoYo terminal migration</p>
        </div>

        <TabsList variant="line" className="sidebar-nav">
          <TabsTrigger value="overview" className="sidebar-link">
            <LayoutDashboard /><span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="flow" className="sidebar-link">
            <GitBranch /><span>Campaign flow</span>
          </TabsTrigger>
          <TabsTrigger value="merchants" className="sidebar-link">
            <Building2 /><span>Merchants</span><span className="nav-count">100</span>
          </TabsTrigger>
          <TabsTrigger value="call" className="sidebar-link">
            <Bot /><span>Dutch AI call</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="sidebar-link">
            <Activity /><span>Activity log</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-auto hidden rounded-2xl border border-white/10 bg-white/[0.06] p-4 lg:block">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <CircleDot className="size-4 text-[#66d4c1]" />Campaign live
          </div>
          <p className="mt-2 text-xs leading-5 text-white/55">12 Dutch calls scheduled today</p>
        </div>
      </aside>

      <main className="content-shell">
        <header className="topbar">
          <p className="text-sm text-[#74837f]">Outbound campaigns / <span className="font-medium text-[#25413d]">YoYo</span></p>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-[#dce6e3] bg-white px-3 py-2 text-sm text-[#49615c] sm:flex">
              <span className="genesys-logo-crop" aria-hidden="true">
                <img src="/genesys-logo.png" alt="" />
              </span>
              <span>Genesys connected</span>
              <span className="size-1.5 rounded-full bg-[#55baab]" aria-hidden="true" />
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-[#2f8277] text-sm font-semibold text-white">KY</div>
          </div>
        </header>

        <TabsContent value="overview" className="page-panel">
          <section className="page-heading">
            <div>
              <div className="flex items-center gap-2">
                <h1>YoYo merchant migration</h1>
                <Badge className="bg-[#e3f6f2] text-[#2f8277] hover:bg-[#e3f6f2]">Live</Badge>
              </div>
              <p>Personalized email, WhatsApp and Dutch AI calls for terminal replacement.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="border-[#cddbd7] bg-white text-[#294641]">
                <Download /> Export report
              </Button>
              <Button className="bg-[#2f8277] text-white hover:bg-[#286f66]">
                <Users /> Import merchants
              </Button>
            </div>
          </section>

          <section className="campaign-hero">
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-medium text-[#77decc]">
                <Sparkles className="size-4" />Campaign progress
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">68 of 100 merchants have progressed</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">The next AI-call window starts at 14:00. Six human advisors are available for warm transfers.</p>
              <Progress value={68} className="mt-6 h-2.5 max-w-xl bg-white/20 [&>div]:bg-white" />
              <div className="mt-3 flex max-w-xl justify-between text-xs text-white/55">
                <span>Started 27 Aug</span><span>68% complete</span>
              </div>
            </div>
            <div className="hero-orbit" aria-hidden="true"><span /><span /><span /></div>
          </section>

          <section className="metrics-grid">
            <MetricCard label="Merchants" value="100" detail="6 added this week" icon={Users} />
            <MetricCard label="Reached" value="72" detail="72% contact rate" icon={PhoneCall} />
            <MetricCard label="Interested" value="24" detail="33% of reached" icon={Sparkles} />
            <MetricCard label="Transferred" value="11" detail="46% of interested" icon={UserRoundCheck} />
          </section>

          <section className="dashboard-grid">
            <article className="surface-card lg:col-span-2">
              <div className="card-heading">
                <div><h2>Automated journey</h2><p>Current merchant distribution across the campaign</p></div>
                <Badge variant="outline" className="border-[#d4e2df] text-[#54706a]">3 retry cycles</Badge>
              </div>
              <div className="journey-track">
                {[
                  [Mail, "Prep email", "100", "sent"],
                  [MessageCircle, "WhatsApp", "31", "unopened"],
                  [Bot, "Dutch AI call", "72", "reached"],
                  [Headphones, "Human handover", "11", "transferred"],
                ].map(([Icon, label, value, detail], index) => {
                  const StageIcon = Icon as typeof Mail
                  return (
                    <div className="journey-stage" key={String(label)}>
                      <div className="stage-icon"><StageIcon /></div>
                      <div>
                        <p className="text-sm font-semibold text-[#24413c]">{String(label)}</p>
                        <p className="mt-1 text-2xl font-semibold tracking-tight text-[#15332e]">{String(value)}</p>
                        <p className="text-xs text-[#84918e]">{String(detail)}</p>
                      </div>
                      {index < 3 && <ChevronRight className="stage-arrow" />}
                    </div>
                  )
                })}
              </div>
            </article>

            <article className="surface-card row-span-2">
              <div className="card-heading"><div><h2>Conversion</h2><p>From contacted to qualified</p></div></div>
              <div className="flex flex-col items-center py-4">
                <div className="donut-chart" role="img" aria-label="33 percent qualification rate">
                  <div><strong>33%</strong><span>qualified</span></div>
                </div>
                <div className="mt-6 w-full space-y-4">
                  {[
                    ["Online self-service", 13, "#55baab"],
                    ["Warm transfer", 11, "#2f8277"],
                    ["Human callback", 8, "#8d75d7"],
                  ].map(([label, value, color]) => (
                    <div key={String(label)}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-[#60716d]">{String(label)}</span>
                        <span className="font-semibold text-[#253f3a]">{String(value)}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#eaf0ee]">
                        <div className="h-full rounded-full" style={{ width: `${Number(value) * 5}%`, backgroundColor: String(color) }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="surface-card lg:col-span-2">
              <div className="card-heading">
                <div><h2>Next scheduled calls</h2><p>Allocated against bot and advisor capacity</p></div>
                <Button variant="ghost" size="sm" className="text-[#2f8277]">View all <ArrowUpRight /></Button>
              </div>
              <div className="divide-y divide-[#e6eeeb]">
                {merchants.slice(0, 3).map((merchant, index) => (
                  <button key={merchant.id} onClick={() => openMerchant(merchant)} className="schedule-row">
                    <span className="time-block">{["14:30", "14:45", "16:10"][index]}</span>
                    <span className="min-w-0 flex-1 text-left">
                      <strong>{merchant.name}</strong><small>{merchant.city} · {merchant.terminal}</small>
                    </span>
                    <span className="hidden text-right sm:block">
                      <strong className="text-sm font-medium text-[#31504a]">{index === 1 ? "Transfer capacity ready" : "Dutch AI call"}</strong>
                      <small>{merchant.contact}</small>
                    </span>
                    <ChevronRight className="size-4 text-[#91a39f]" />
                  </button>
                ))}
              </div>
            </article>
          </section>
        </TabsContent>

        <TabsContent value="flow" className="page-panel">
          <section className="page-heading">
            <div>
              <div className="flex items-center gap-2">
                <h1>Campaign flow</h1>
                <Badge className="bg-[#e3f6f2] text-[#2f8277] hover:bg-[#e3f6f2]">Automated</Badge>
              </div>
              <p>From merchant-list preparation to the scheduled Dutch AI voicebot call.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#cfe3de] bg-white px-3 py-2 text-sm text-[#30534c]">
              <span className="size-2 rounded-full bg-[#55baab]" /> Genesys orchestrated
            </div>
          </section>

          <section className="flow-page-grid">
            <article className="surface-card reference-flow-canvas">
              <div className="reference-flow">
              <div className="reference-linear">
                <FlowNode
                  icon={Users}
                  imageSrc="https://upload.wikimedia.org/wikipedia/commons/8/89/Salesforce_Users_Email_list.png"
                  imageAlt="Salesforce"
                  label="Campaign input"
                  title="Import or synchronise merchant list"
                />
                <FlowNode
                  icon={CheckCircle2}
                  label="Internal review"
                  title="Review POS lifecycle, replacement eligibility, communication history, objections, preferences and open issues"
                />
                <FlowNode
                  icon={Search}
                  imageSrc="https://upload.wikimedia.org/wikipedia/commons/6/66/OpenAI_logo_2025_%28symbol%29.svg"
                  imageAlt="OpenAI"
                  label="Deep research"
                  title="Research merchant activity, locations, hours, website, services, customers, payment environment, terminal fit and recent developments"
                />
                <FlowNode icon={Sparkles} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Personalisation" title="Generate merchant profile and personalised campaign content" />
                <FlowNode icon={CalendarClock} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Scheduling" title="Allocate Dutch AI-call slot" />
                <FlowNode icon={Mail} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Preparation" title="Send personalised preparation email" />
              </div>

              <div className="reference-decision-wrap">
                <div className="reference-decision"><span>Merchant action before call?</span></div>
              </div>

              <div className="reference-branch-grid">
                <div className="reference-branch">
                  <span className="reference-branch-label">Completes online</span>
                  <FlowNode icon={CheckCircle2} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Complete" title="Confirm replacement and cancel call" tone="success" />
                </div>

                <div className="reference-branch">
                  <span className="reference-branch-label">Selects callback slot</span>
                  <FlowNode icon={Headphones} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Human callback" title="Book human agent and cancel AI call" tone="human" />
                </div>

                <div className="reference-ai-path">
                  <div className="reference-ai-inputs">
                    <div className="reference-ai-input reference-ai-input-pass">
                      <span className="reference-branch-label">Email opened but no action</span>
                      <div className="reference-pass-through" aria-hidden="true" />
                    </div>
                    <div className="reference-ai-input">
                      <span className="reference-branch-label">Email not opened</span>
                      <FlowNode
                        icon={MessageCircle}
                        imageSrc="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                        imageAlt="WhatsApp"
                        label="Reminder"
                        title="Send WhatsApp reminder"
                      />
                    </div>
                  </div>
                  <div className="reference-ai-merge" aria-hidden="true"><span /></div>
                  <div className="reference-ai-continuation">
                    <FlowNode icon={CalendarClock} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Scheduled call" title="Keep allocated AI-call slot" />
                    <FlowNode icon={Bot} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Contact · nl-BE" title="Dutch AI voicebot calls merchant" />
                  </div>
                </div>
              </div>
              </div>
            </article>

            <aside className="surface-card flow-rules">
              <div className="card-heading">
                <div><h2>Genesys components</h2><p>Native services used in the journey</p></div>
              </div>
              <div className="flow-rule-list">
                <div><span>01</span><p><strong>Outbound Campaigns</strong>Controls merchant lists, allocated calling times and retry attempts.</p></div>
                <div><span>02</span><p><strong>Architect</strong>Orchestrates voice, email and WhatsApp steps, decisions and routing.</p></div>
                <div><span>03</span><p><strong>Data Actions</strong>Loads internal records and connects external enrichment services.</p></div>
                <div><span>04</span><p><strong>Bot and GenAI integration</strong>Handles Dutch free speech, intent and merchant objections.</p></div>
                <div><span>05</span><p><strong>Work Automation and Agent Workspace</strong>Creates callbacks, tasks and warm transfers with full context.</p></div>
              </div>
              <div className="flow-system-note">
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#e3f6f2] text-[#2f8277]"><Activity className="size-4" /></span>
                <div><strong>Recording and analytics</strong><p>Transcripts, contact results and campaign events feed the dashboard.</p></div>
              </div>
            </aside>
          </section>

          <section className="call-flow-heading">
            <div>
              <span className="section-eyebrow">Stage 2</span>
              <h2>Dutch AI call and outcome flow</h2>
              <p>From the allocated call through sales handoff, follow-up, refusal or retry.</p>
            </div>
            <Badge className="bg-[#eef4f3] text-[#58716c] hover:bg-[#eef4f3]">Maximum 3 attempts</Badge>
          </section>

          <article className="surface-card call-outcome-canvas">
            <div className="call-outcome-flow">
              <div className="call-flow-start">
              <FlowNode icon={PhoneCall} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Contact · nl-BE" title="Dutch AI call at allocated time" />
              <div className="call-flow-arrow" aria-hidden="true" />
              <FlowNode icon={UserRoundCheck} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Opening" title="Verify contact and explain terminal replacement" />
              <div className="call-flow-arrow" aria-hidden="true" />
              <div className="call-flow-decision"><span>Merchant response</span></div>
            </div>

              <div className="call-response-grid">
              <section className="call-response-lane call-sales-lane">
                <div className="call-sales-entry-grid">
                  <div className="call-response-entry call-entry-pass">
                    <span className="call-branch-label">Interested</span>
                    <div className="call-pass-through" aria-hidden="true" />
                  </div>
                  <div className="call-response-entry">
                    <span className="call-branch-label">Hesitant</span>
                    <FlowNode icon={MessageCircle} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Objection handling" title="Explain urgency and handle objections" />
                  </div>
                </div>
                <div className="call-sales-merge" aria-hidden="true"><span /></div>
                <FlowNode icon={Sparkles} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Sales discovery" title="Needs analysis and personalised offer" />
                <div className="call-flow-arrow" aria-hidden="true" />
                <div className="call-flow-decision call-flow-decision-small"><span>Continue sales process?</span></div>
                <div className="call-choice-grid">
                  <div className="call-choice-branch">
                    <span className="call-branch-label">Yes</span>
                    <FlowNode icon={Headphones} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Live handoff" title="Warm transfer to human agent" tone="human" />
                  </div>
                  <div className="call-choice-branch">
                    <span className="call-branch-label">Later</span>
                    <FlowNode icon={CalendarClock} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Scheduled handoff" title="Book human-agent callback" tone="human" />
                  </div>
                </div>
              </section>

              <section className="call-response-lane">
                <span className="call-branch-label">Requests email</span>
                <FlowNode icon={Mail} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Information follow-up" title="Clarify concerns, send information and book callback" />
              </section>

              <section className="call-response-lane">
                <span className="call-branch-label">Explicit refusal</span>
                <FlowNode icon={CheckCircle2} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Journey closed" title="Close outcome or apply opt-out" />
              </section>

              <section className="call-response-lane call-failure-lane">
                <span className="call-branch-label">No answer or failure</span>
                <div className="call-flow-decision call-flow-decision-small"><span>Attempt number</span></div>
                <div className="call-attempt-grid">
                  <div className="call-choice-branch">
                    <span className="call-branch-label">Attempt 3</span>
                    <FlowNode icon={Headphones} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Manual follow-up" title="Create human follow-up task" tone="human" />
                  </div>
                  <div className="call-choice-branch">
                    <span className="call-branch-label">Attempt 1 or 2</span>
                    <FlowNode icon={RefreshCw} imageSrc="/genesys-logo.png" imageAlt="Genesys" cropLogo label="Retry" title="Send new preparation email and allocate new slot" />
                    <div className="call-loop-return"><RefreshCw /><span>Return to the allocated Dutch AI call</span></div>
                  </div>
                </div>
              </section>
              </div>
            </div>
          </article>
        </TabsContent>

        <TabsContent value="merchants" className="page-panel">
          <section className="page-heading">
            <div><h1>Merchants</h1><p>Review enrichment, campaign status and the next action for every merchant.</p></div>
            <Button className="bg-[#2f8277] text-white hover:bg-[#286f66]"><Users /> Import list</Button>
          </section>

          <section className="surface-card p-0">
            <div className="flex flex-col gap-3 border-b border-[#e2ebe8] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7c8c88]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search merchant, contact or city"
                  className="h-10 w-full rounded-lg border border-[#d5e1de] bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#55baab] focus:ring-3 focus:ring-[#55baab]/15"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 w-full border-[#d5e1de] bg-white sm:w-[190px]"><SelectValue placeholder="All statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Call scheduled">Call scheduled</SelectItem>
                  <SelectItem value="Interested">Interested</SelectItem>
                  <SelectItem value="Transferred">Transferred</SelectItem>
                  <SelectItem value="Callback booked">Callback booked</SelectItem>
                  <SelectItem value="WhatsApp sent">WhatsApp sent</SelectItem>
                  <SelectItem value="Retry 2 of 3">Retrying</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f7faf9] hover:bg-[#f7faf9]">
                  <TableHead className="pl-5">Merchant</TableHead><TableHead>Current terminal</TableHead><TableHead>Status</TableHead><TableHead>Next action</TableHead><TableHead>Priority</TableHead><TableHead className="pr-5 text-right">Timing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerchants.map((merchant) => (
                  <TableRow key={merchant.id} className="h-[76px]">
                    <TableCell className="pl-5">
                      <Button variant="link" onClick={() => openMerchant(merchant)} className="h-auto p-0 text-left text-[#163e38] no-underline hover:text-[#2f8277]">
                        <span className="flex flex-col items-start">
                          <strong className="font-semibold">{merchant.name}</strong>
                          <small className="mt-1 text-xs font-normal text-[#7b8986]">{merchant.contact} · {merchant.city}</small>
                        </span>
                      </Button>
                    </TableCell>
                    <TableCell className="text-[#49605b]">{merchant.terminal}</TableCell>
                    <TableCell><StatusPill status={merchant.status} /></TableCell>
                    <TableCell className="text-[#49605b]">{merchant.nextAction}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={merchant.score} className="h-1.5 w-16 bg-[#e2eeeb] [&>div]:bg-[#55baab]" />
                        <span className="text-xs font-semibold text-[#395650]">{merchant.score}</span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-5 text-right text-[#637570]">{merchant.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredMerchants.length === 0 && (
              <div className="flex min-h-48 flex-col items-center justify-center p-8 text-center">
                <Search className="size-7 text-[#9baba7]" />
                <p className="mt-3 font-medium text-[#29453f]">No merchants found</p>
                <p className="mt-1 text-sm text-[#7a8986]">Try another name or campaign status.</p>
              </div>
            )}
          </section>
        </TabsContent>

        <TabsContent value="call" className="page-panel">
          <section className="page-heading">
            <div>
              <div className="flex items-center gap-2"><h1>Dutch AI call</h1><Badge className="bg-[#e3f6f2] text-[#2f8277] hover:bg-[#e3f6f2]">nl-BE</Badge></div>
              <p>Preview how the agent uses prepared context and reacts to the merchant.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#cfe3de] bg-white px-3 py-2 text-sm text-[#30534c]">
              <span className="size-2 animate-pulse rounded-full bg-[#55baab]" /> 1.2 sec response
            </div>
          </section>

          <section className="call-grid">
            <article className="surface-card context-panel">
              <div className="card-heading">
                <div><h2>Prepared context</h2><p>Loaded before dialling</p></div><Sparkles className="size-5 text-[#55baab]" />
              </div>
              <div className="merchant-avatar">DK</div>
              <h3 className="mt-4 font-semibold text-[#193b35]">Bakkerij De Korenaar</h3>
              <p className="mt-1 text-sm text-[#72827e]">Sofie De Smet · Antwerpen</p>
              <div className="context-group">
                <span className="context-group-label">Internal record</span>
                <div className="context-data-grid">
                  <div className="info-block"><span>Current terminal</span><strong>Yomani XR · 2 devices</strong></div>
                  <div className="info-block"><span>Contact</span><strong>Sofie De Smet</strong></div>
                  <div className="info-block"><span>Communication</span><strong>Concise · after lunch rush</strong></div>
                  <div className="info-block"><span>Other campaigns</span><strong>None active</strong></div>
                </div>
              </div>
              <div className="context-group research-context">
                <span className="context-group-label">Deep research</span>
                <strong>Bakkerij · 2 locations · open 06:30–18:00</strong>
                <p>Family bakery with two checkout points and high morning debit-card volume. Saturn 1000F2 is the recommended fit.</p>
                <small>Recent development: second Antwerp location registered in 2026.</small>
              </div>
            </article>

            <article className="phone-stage">
              <div className="phone-header">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#e3f6f2] text-[#2f8277]"><Bot className="size-5" /></div>
                  <div><strong>Noor · AI advisor</strong><span>Connected · Dutch with English translation</span></div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={isSpeaking ? stopCallAudio : playCallAudio}
                  className="audio-play-button"
                  aria-label={isSpeaking ? "Stop Dutch call audio" : "Play Dutch call audio"}
                >
                  {isSpeaking ? <Square /> : <Volume2 />}
                  <span>{isSpeaking ? "Stop" : "Play call"}</span>
                </Button>
              </div>

              <div className="transcript" aria-live="polite">
                <div className="speech bot-speech">
                  <span>AI advisor</span>
                  <p>Goedemiddag, u spreekt met Noor, de digitale assistent van Worldline. Spreek ik met mevrouw De Smet?<em className="translation">Good afternoon, this is Noor, Worldline’s digital assistant. Am I speaking with Ms De Smet?</em></p>
                </div>
                <div className="speech merchant-speech">
                  <span>Sofie De Smet</span>
                  <p>Ja, dat klopt.<em className="translation">Yes, that’s correct.</em></p>
                </div>
                <div className="speech bot-speech">
                  <span>AI advisor</span>
                  <p>Heeft u onze e-mail over de vervanging van uw betaalterminal ontvangen?<em className="translation">Did you receive our email about replacing your payment terminal?</em></p>
                </div>
                <div className="speech merchant-speech emphasis">
                  <span>Sofie De Smet</span>
                  <p>{response.merchant}<em className="translation">{response.merchantEnglish}</em></p>
                </div>
                <div className="speech bot-speech emphasis">
                  <span>AI advisor · generated in 1.2 sec</span>
                  <p>{response.bot}<em className="translation">{response.botEnglish}</em></p>
                </div>
              </div>

              <div className="scenario-controls">
                <p>Simulate merchant response</p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant={scenario === "objection" ? "default" : "outline"} onClick={() => changeScenario("objection")} className={scenario === "objection" ? "bg-[#2f8277]" : "border-[#d2dfdc]"}>Still works</Button>
                  <Button size="sm" variant={scenario === "interested" ? "default" : "outline"} onClick={() => changeScenario("interested")} className={scenario === "interested" ? "bg-[#2f8277]" : "border-[#d2dfdc]"}>Interested</Button>
                  <Button size="sm" variant={scenario === "callback" ? "default" : "outline"} onClick={() => changeScenario("callback")} className={scenario === "callback" ? "bg-[#2f8277]" : "border-[#d2dfdc]"}>Call later</Button>
                </div>
                {audioUnsupported && <p className="audio-note">Audio playback is not supported by this browser.</p>}
              </div>
            </article>

            <article className="surface-card decision-panel">
              <div className="card-heading"><div><h2>Live decision</h2><p>Structured AI output</p></div></div>
              <div className="decision-score">
                <span>Detected intent</span><strong>{response.intent}</strong>
                <div className="mt-3 flex items-center gap-2 text-sm text-[#627671]"><CheckCircle2 className="size-4 text-[#55baab]" /> {response.confidence} confidence</div>
              </div>
              <div className="mt-4 rounded-xl border border-[#dfebe8] p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#899793]">Next action</span>
                <p className="mt-2 font-semibold text-[#203f39]">{response.action}</p>
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold text-[#284640]">Guardrails applied</p>
                <ul className="mt-3 space-y-3 text-sm text-[#637570]">
                  <li><Check /> Approved YoYo facts only</li>
                  <li><Check /> Maximum two sentences</li>
                  <li><Check /> No live research during call</li>
                </ul>
              </div>
              <Button onClick={() => setTransferred(true)} disabled={scenario === "callback"} className="mt-7 w-full bg-[#2f8277] text-white hover:bg-[#286f66]">
                {transferred ? <><CheckCircle2 /> Transfer started</> : <><Headphones /> Warm transfer</>}
              </Button>
              {scenario === "callback" && <p className="mt-3 text-center text-xs text-[#778984]">Human callback booked for tomorrow at 10:00.</p>}
            </article>
          </section>
        </TabsContent>

        <TabsContent value="activity" className="page-panel">
          <section className="page-heading">
            <div><h1>Activity log</h1><p>Every message, call, outcome, transfer and appointment in one timeline.</p></div>
            <Button variant="outline" className="border-[#cddbd7] bg-white text-[#294641]"><Download /> Export CSV</Button>
          </section>
          <section className="surface-card p-0">
            <div className="card-heading border-b border-[#e2ebe8] p-5">
              <div><h2>Today · 2 September</h2><p>46 automated and human activities</p></div>
              <div className="flex items-center gap-2 text-sm text-[#55716b]"><span className="size-2 rounded-full bg-[#55baab]" /> Live updates</div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f7faf9] hover:bg-[#f7faf9]">
                  <TableHead className="pl-5">Time</TableHead><TableHead>Merchant</TableHead><TableHead>Channel</TableHead><TableHead>Event</TableHead><TableHead className="pr-5 text-right">Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logEntries.map(([time, merchant, channel, event, outcome]) => (
                  <TableRow key={`${time}-${merchant}`} className="h-[68px]">
                    <TableCell className="pl-5 font-medium text-[#35544e]">{time}</TableCell>
                    <TableCell className="font-medium text-[#213e39]">{merchant}</TableCell>
                    <TableCell>
                      <span className="channel-label">{channel === "AI call" ? <Bot /> : channel === "WhatsApp" ? <MessageCircle /> : channel === "Email" ? <Mail /> : <CalendarClock />}{channel}</span>
                    </TableCell>
                    <TableCell className="text-[#60736e]">{event}</TableCell>
                    <TableCell className="pr-5 text-right"><Badge variant="outline" className="border-[#cfe4df] bg-[#f0f9f7] text-[#177c6c]">{outcome}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </TabsContent>
      </main>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="merchant-drawer w-full gap-0 overflow-hidden border-[#d9e5e2] bg-[#f7faf9] p-0 sm:max-w-md">
          <SheetHeader className="border-b border-[#dae6e3] bg-white p-5 pr-14">
            <div className="mb-2 flex items-center gap-2"><StatusPill status={selectedMerchant.status} /><span className="text-xs text-[#82908d]">{selectedMerchant.id}</span></div>
            <SheetTitle className="text-xl tracking-[-0.03em] text-[#173a34]">{selectedMerchant.name}</SheetTitle>
            <SheetDescription>{selectedMerchant.contact} · {selectedMerchant.city}</SheetDescription>
          </SheetHeader>
          <div className="merchant-drawer-body">
            <section className="drawer-section">
              <h3>Internal record</h3>
              <div className="drawer-data-grid">
                <div className="info-block"><span>Current terminal</span><strong>{selectedMerchant.terminal}</strong></div>
                <div className="info-block"><span>Priority score</span><strong>{selectedMerchant.score} / 100</strong></div>
                <div className="info-block"><span>Primary contact</span><strong>{selectedMerchant.contact}</strong></div>
                <div className="info-block"><span>Other campaigns</span><strong>None active</strong></div>
                <div className="info-block col-span-2"><span>Communication history</span><strong>{selectedMerchant.note}</strong></div>
              </div>
            </section>
            <section className="drawer-section">
              <h3>Deep research</h3>
              <p className="drawer-copy">{selectedMerchant.insight}</p>
              <ul className="drawer-research-list">
                <li>Business type, locations and opening hours</li>
                <li>Website, services and customer profile</li>
                <li>Payment environment and replacement fit</li>
                <li>Recent developments and trade-register changes</li>
              </ul>
            </section>
            <section className="drawer-section">
              <h3>Personalized pitch</h3>
              <p className="drawer-copy">Explain that the {selectedMerchant.terminal} will stop receiving software updates. Lead with continuity, then present the 25% terminal discount, free on-site installation, free activation and one year of technical support.</p>
            </section>
            <section className="drawer-section">
              <h3>Journey</h3>
              <div className="mt-3 space-y-3">
                {[
                  [CheckCircle2, "Preparation email", "Opened today at 09:47"],
                  [CheckCircle2, "Merchant enrichment", "Profile ready before contact"],
                  [Clock3, selectedMerchant.nextAction, selectedMerchant.time],
                ].map(([Icon, label, detail]) => {
                  const TimelineIcon = Icon as typeof CheckCircle2
                  return <div className="timeline-row" key={String(label)}><TimelineIcon /><div><strong>{String(label)}</strong><span>{String(detail)}</span></div></div>
                })}
              </div>
            </section>
          </div>
          <SheetFooter className="border-t border-[#dae6e3] bg-white p-4 sm:flex-row">
            <Button variant="outline" className="flex-1 border-[#cadbd7]"><FileText /> View full history</Button>
            <Button className="flex-1 bg-[#2f8277] text-white hover:bg-[#286f66]"><Phone /> Start Dutch call</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Tabs>
  )
}

"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Users, 
  Sparkles, 
  Filter,
  GraduationCap,
  MessageSquare,
  Tag,
  PlusCircle,
  Mail,
  Send,
  CheckCircle2
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import AddModal from "@/components/AddModal";
import { REAL_EVENTS, REAL_TEAMMATES, EventItem, TeammateItem } from "../lib/data";

const CATEGORIES = ["ყველა", "ჰაკათონი", "ვორქშოფი", "გაცვლითი პროგრამა", "სტაჟირება", "სხვა"];
const UNIVERSITIES = ["ყველა უნივერსიტეტი", "თსუ (TSU)", "ილიაუნი (Iliauni)", "CU", "CIU", "GAU", "UG (საქართველოს უნივერსიტეტი)", "BTU", "სხვა"];

function HomeContent() {
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab") === "teammates" ? "teammates" : "events";

  const [activeTab, setActiveTab] = useState<"events" | "teammates">(urlTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ყველა");
  const [selectedUniversity, setSelectedUniversity] = useState("ყველა უნივერსიტეტი");
  
  // State for Modal and Data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<EventItem[]>(REAL_EVENTS);
  const [teammates, setTeammates] = useState<TeammateItem[]>(REAL_TEAMMATES);
  const [loading, setLoading] = useState(true);

  // State for Email Newsletter Subscription
  const [emailInput, setEmailInput] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  const currentTab = searchParams.has("tab") ? urlTab : activeTab;

  // Supabase-იდან მონაცემების წამოღება
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];

      try {
        // 1. ივენთები (მხოლოდ დადასტურებული და დღევანდელზე მეტი/ტოლი თარიღით)
        const { data: dbEvents, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        if (!eventsError && dbEvents && dbEvents.length > 0) {
          const formattedEvents: EventItem[] = dbEvents
            .filter((e) => !e.event_date || e.event_date >= today) // ავტომატური ვადაგასულობის ფილტრი
            .map((e) => ({
              id: e.id,
              title: e.title,
              category: e.category,
              university: e.organizer || "ყველა უნივერსიტეტი",
              date: e.date,
              location: e.location,
              summary: e.description,
              tags: [e.category],
              organizer: e.organizer,
              link: e.link,
            }));
          setEvents(formattedEvents);
        }

        // 2. მეწყვილეების განცხადებები (მხოლოდ დადასტურებული)
        const { data: dbTeammates, error: teammatesError } = await supabase
          .from("teammates")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        if (!teammatesError && dbTeammates && dbTeammates.length > 0) {
          const formattedTeammates: TeammateItem[] = dbTeammates.map((t) => ({
            id: t.id,
            name: t.author,
            university: t.university,
            role: t.role_needed,
            targetEvent: t.title,
            bio: t.description,
            lookingFor: t.role_needed,
            skills: [t.role_needed],
            contact: t.contact.startsWith("http") ? t.contact : `https://t.me/${t.contact.replace("@", "")}`,
          }));
          setTeammates(formattedTeammates);
        }
      } catch (err) {
        console.error("Supabase fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Email Subscription Handler
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) return;

    setSubscribing(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email: emailInput.trim() }]);

      if (!error) {
        setSubscribedSuccess(true);
        setEmailInput("");
      } else {
        alert("ელფოსტა უკვე დარეგისტრირებულია ან დაფიქსირდა შეცდომა.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
    } finally {
      setSubscribing(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.summary.toLowerCase().includes(q) ||
        event.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === "ყველა" || event.category === selectedCategory;
      const matchesUni = selectedUniversity === "ყველა უნივერსიტეტი" || event.university.includes(selectedUniversity);

      return matchesSearch && matchesCategory && matchesUni;
    });
  }, [events, searchQuery, selectedCategory, selectedUniversity]);

  const filteredTeammates = useMemo(() => {
    return teammates.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.targetEvent.toLowerCase().includes(q) ||
        item.skills.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [teammates, searchQuery]);

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-300">
      {/* HERO SECTION */}
      <section className="w-full relative overflow-hidden border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md py-16 px-4 sm:px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-80 w-[500px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>სტუდენტური შესაძლებლობების ჰაბი</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            რა ხდება ქართულ <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">კამპუსებში?</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            ყველა ჰაკათონი, ვორქშოფი, გაცვლითი პროგრამა და სტაჟირება ერთ სივრცეში.
          </p>

          {/* TAB SWITCHER & ADD BUTTON */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <div className="bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300/80 dark:border-slate-800 p-1.5 rounded-2xl flex gap-1 shadow-inner backdrop-blur-md">
              <button
                onClick={() => setActiveTab("events")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === "events"
                    ? "bg-emerald-500 text-white dark:text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-slate-800/60"
                }`}
              >
                <Calendar className="w-4 h-4" />
                ღონისძიებები ({events.length})
              </button>
              <button
                onClick={() => setActiveTab("teammates")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === "teammates"
                    ? "bg-emerald-500 text-white dark:text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-slate-800/60"
                }`}
              >
                <Users className="w-4 h-4" />
                იპოვე მეწყვილე ({teammates.length})
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-2xl text-sm font-semibold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-emerald-500" />
              + დაამატე
            </button>
          </div>

          {/* EMAIL NEWSLETTER SUBSCRIPTION BOX */}
          <div className="pt-6 max-w-md mx-auto">
            {subscribedSuccess ? (
              <div className="flex items-center justify-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>წარმატებით დარეგისტრირდი! შეტყობინებებს მიიღებ Gmail-ზე.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 bg-[#1e293b]/40 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-1.5 rounded-2xl shadow-sm focus-within:border-emerald-500 transition-all">
                <div className="flex items-center pl-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="შენი Gmail / Email..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  {subscribing ? "..." : "გამოწერა"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH BAR SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder={currentTab === "events" ? "ძებნა (მაგ. ჰაკათონი, AI...)" : "ძებნა უნარებით ან სახელით..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-all"
            />
          </div>

          {currentTab === "events" && (
            <>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-2xl px-3.5 py-1 shadow-sm">
                <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none py-2 cursor-pointer font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-2xl px-3.5 py-1 shadow-sm">
                <GraduationCap className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none py-2 cursor-pointer font-medium"
                >
                  {UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                      {uni}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* CONTENT GRID */}
        {currentTab === "events" ? (
          filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-emerald-500/5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        {event.category}
                      </span>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
                        {event.university}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                      {event.title}
                    </h2>

                    <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {event.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {event.tags.map((tag) => (
                        <span key={tag} className="text-[11px] bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/50 flex items-center gap-1 font-medium">
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px]">
                      {event.organizer}
                    </span>
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white dark:text-slate-950 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-300 px-4 py-2.5 rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                      წყაროზე გადასვლა
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/30">
              <p className="text-slate-500 dark:text-slate-400 font-medium">ღონისძიება ვერ მოიძებნა ამ ფილტრით.</p>
            </div>
          )
        ) : (
          filteredTeammates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTeammates.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 hover:border-emerald-500/40 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.university}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                        {item.role}
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <p className="text-xs text-slate-400 font-medium">მიზნობრივი ივენთი:</p>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{item.targetEvent}</p>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.bio}</p>

                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 font-medium">ეძებს:</p>
                      <p className="text-xs text-slate-800 dark:text-white font-semibold">{item.lookingFor}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {item.skills.map((skill) => (
                        <span key={skill} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/50 font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                    <a
                      href={item.contact}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold py-2.5 rounded-xl border border-emerald-500/30 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      დაუკავშირდი Telegram / Social-ზე
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/30">
              <p className="text-slate-500 dark:text-slate-400 font-medium">განცხადებები არ არის.</p>
            </div>
          )
        )}
      </section>

      {/* ADD MODAL */}
      <AddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
      <HomeContent />
    </Suspense>
  );
}
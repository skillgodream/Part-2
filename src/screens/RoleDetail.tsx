import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Armchair, 
  Plane, 
  Utensils, 
  Briefcase, 
  Home, 
  Globe, 
  Bookmark, 
  Settings,
  CheckCircle2,
  X
} from 'lucide-react';
import { JOB_ROLES, SKILL_CATEGORIES } from '../lib/catalog';
import { useRouter } from '../lib/router';
import { useCartState, useEnrollmentState } from '../lib/enrollmentStore';
import { JobRole, SkillCategory, PlanType } from '../lib/types';
import { CartModal } from '../components/CartModal';

interface TicketItem {
  id: string;
  fromCode: string;
  fromCity: string;
  departureTime: string;
  flightDuration: string;
  toCode: string;
  toCity: string;
  arrivalTime: string;
  serviceClass: string;
  airlineName: string;
  price: string;
  numericPrice: number;
}

export function RoleDetailScreen() {
  const { currentRoute, navigate } = useRouter();
  const { addToCart, isSkillEnrolled } = useCartState();
  const { enrollSkill } = useEnrollmentState();

  // Resolve Role and Skill dynamically from route parameters
  const roleId = currentRoute.params?.roleId || JOB_ROLES[0].id;
  const role: JobRole = JOB_ROLES.find(r => r.id === roleId) || JOB_ROLES[0];
  const skill: SkillCategory = SKILL_CATEGORIES.find(s => s.id === role.skillId) || SKILL_CATEGORIES[0];

  const [activeTripType, setActiveTripType] = useState<'one-way' | 'round-trip' | 'multy-city'>('one-way');
  const [showCartModal, setShowCartModal] = useState(false);
  const [ticketConfirmed, setTicketConfirmed] = useState<TicketItem | null>(null);

  const isEnrolled = isSkillEnrolled(role.id);

  // Tickets matching the reference screenshot design
  const tickets: TicketItem[] = [
    {
      id: 'ticket-1',
      fromCode: 'SIN',
      fromCity: 'Singapore',
      departureTime: '06.00',
      flightDuration: '1h 30m',
      toCode: 'CGK',
      toCity: 'Jakarta',
      arrivalTime: '07.30',
      serviceClass: 'Business Class',
      airlineName: 'Lorem Airways',
      price: '$200',
      numericPrice: 200,
    },
    {
      id: 'ticket-2',
      fromCode: 'SIN',
      fromCity: 'Singapore',
      departureTime: '09.00',
      flightDuration: '1h 30m',
      toCode: 'CGK',
      toCity: 'Jakarta',
      arrivalTime: '10.30',
      serviceClass: 'Business Class',
      airlineName: 'Ipsum Airways',
      price: '$200',
      numericPrice: 200,
    },
    {
      id: 'ticket-3',
      fromCode: 'SIN',
      fromCity: 'Singapore',
      departureTime: '14.00',
      flightDuration: '1h 30m',
      toCode: 'CGK',
      toCity: 'Jakarta',
      arrivalTime: '15.30',
      serviceClass: 'Business Class',
      airlineName: 'Dolor Express',
      price: '$200',
      numericPrice: 200,
    },
  ];

  const handleSelectTicket = (ticket: TicketItem) => {
    addToCart({
      id: `cart-skill-${role.id}-${ticket.id}`,
      productId: role.id,
      productType: 'skill',
      title: `${role.title} (${ticket.airlineName})`,
      price: ticket.numericPrice,
      selectedPlan: 'pro' as PlanType,
      skillId: skill.id,
      duration: `${role.durationWeeks || 4} Weeks`
    });
    setTicketConfirmed(ticket);
  };

  return (
    <div className="w-full min-h-screen bg-[#1157C7] flex justify-center selection:bg-blue-300 select-none pb-24">
      
      {/* Mobile Device Frame Container */}
      <div className="w-full max-w-md bg-[#135ED1] min-h-screen relative flex flex-col overflow-hidden shadow-2xl">
        
        {/* 1. TOP HERO SECTION (Airplane boarding background + Floating pill) */}
        <div className="relative w-full h-[220px] shrink-0 overflow-hidden">
          {/* Background Airport / Airplane Image */}
          <img 
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80" 
            alt="Boarding Gateway" 
            className="w-full h-full object-cover object-center"
          />
          
          {/* Subtle dark glass overlay for perfect readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/50" />

          {/* Top Bar with Back Button */}
          <div className="absolute top-4 left-4 z-20">
            <button 
              onClick={() => navigate('choose-skill', { selectedSkillId: skill.id })}
              className="w-9 h-9 rounded-xl bg-white/90 text-slate-800 shadow-md flex items-center justify-center hover:bg-white active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-[#0E2856] stroke-[2.5]" />
            </button>
          </div>

          {/* Center Origin & Destination Floating Widget */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 px-4 z-10 text-center">
            <span className="text-xs text-white/80 font-semibold tracking-wide">From</span>
            <h1 className="text-xl font-extrabold text-white tracking-tight drop-shadow-md">
              Changi, Singapore
            </h1>
            
            {/* Pill Badge: "To : Jakarta, Indonesia" */}
            <div className="mt-1.5 bg-white/95 backdrop-blur-md px-4 py-1 rounded-full shadow-lg border border-white/40 flex items-center gap-1">
              <span className="text-[11px] font-semibold text-slate-500">To :</span>
              <span className="text-[11px] font-extrabold text-[#1864DB]">Jakarta, Indonesia</span>
            </div>
          </div>
        </div>

        {/* 2. ROYAL BLUE ARCHED CONTAINER */}
        <div className="w-full bg-[#1864DB] rounded-t-[34px] -mt-6 z-20 flex-1 px-5 pt-4 pb-28 flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
          
          {/* Mini Action Icons (Calendar & Seat) */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button 
              className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform"
              title="Schedule / Calendar"
            >
              <Calendar className="w-5 h-5 text-[#1864DB] stroke-[2.2]" />
            </button>
            <button 
              className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform"
              title="Seat Selection"
            >
              <Armchair className="w-5 h-5 text-[#1864DB] stroke-[2.2]" />
            </button>
          </div>

          {/* Trip Type Segmented Tab Bar */}
          <div className="flex items-center justify-between px-2 mb-5">
            <button
              onClick={() => setActiveTripType('one-way')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTripType === 'one-way'
                  ? 'border border-white/90 text-white shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              One Way
            </button>
            <button
              onClick={() => setActiveTripType('round-trip')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTripType === 'round-trip'
                  ? 'border border-white/90 text-white shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Round Trip
            </button>
            <button
              onClick={() => setActiveTripType('multy-city')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTripType === 'multy-city'
                  ? 'border border-white/90 text-white shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Multy - City
            </button>
          </div>

          {/* 3. STACKED FLIGHT / CAREER PASS TICKET CARDS */}
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div 
                key={ticket.id}
                className="w-full bg-white rounded-[22px] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.12)] border border-white/60 transition-transform active:scale-[0.99]"
              >
                {/* Top Half: Origin, Airplane Icon, Destination */}
                <div className="flex items-center justify-between px-1">
                  
                  {/* Origin */}
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-slate-900 leading-none">
                      {ticket.fromCode}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {ticket.fromCity}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 mt-2">
                      {ticket.departureTime}
                    </span>
                  </div>

                  {/* Flight Duration & Plane */}
                  <div className="flex flex-col items-center justify-center px-2">
                    <div className="text-[#1864DB] mb-1">
                      <Plane className="w-5 h-5 fill-[#1864DB] rotate-45 transform" />
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      {ticket.flightDuration}
                    </span>
                  </div>

                  {/* Destination */}
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-black text-slate-900 leading-none">
                      {ticket.toCode}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {ticket.toCity}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 mt-2">
                      {ticket.arrivalTime}
                    </span>
                  </div>

                </div>

                {/* Perforated Dashed Divider */}
                <div className="w-full border-b border-dashed border-slate-300 my-3" />

                {/* Bottom Half: Class Icons & Airline Price Pill */}
                <div className="flex items-center justify-between px-1">
                  
                  {/* Class Info */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-white">
                        <Utensils className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-white">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-600 font-bold mt-1">
                      {ticket.serviceClass}
                    </span>
                  </div>

                  {/* Airline Name & Price Button */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-extrabold text-[#1864DB]">
                      {ticket.airlineName}
                    </span>
                    <button
                      onClick={() => handleSelectTicket(ticket)}
                      className="bg-[#1864DB] hover:bg-blue-700 active:scale-95 text-white text-xs font-extrabold px-6 py-1.5 rounded-full shadow-md transition-all cursor-pointer"
                    >
                      {ticket.price}
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>

        {/* 4. FLOATING WHITE BOTTOM NAVIGATION (4 Icons: Home, Globe, Bookmark, Settings) */}
        <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-6 z-50">
          <div className="w-full bg-white/95 backdrop-blur-xl border border-white/80 rounded-full py-3 px-6 shadow-[0_16px_36px_rgba(0,0,0,0.22)] flex items-center justify-around">
            <button 
              onClick={() => navigate('home')}
              className="text-slate-400 hover:text-blue-600 active:scale-95 transition-colors p-1"
              title="Home"
            >
              <Home className="w-5 h-5 stroke-[2]" />
            </button>
            <button 
              onClick={() => navigate('choose-skill')}
              className="text-blue-600 active:scale-95 transition-colors p-1"
              title="Explore"
            >
              <Globe className="w-5 h-5 stroke-[2]" />
            </button>
            <button 
              onClick={() => navigate('my-learning')}
              className="text-slate-400 hover:text-blue-600 active:scale-95 transition-colors p-1"
              title="Bookmarks / Saved"
            >
              <Bookmark className="w-5 h-5 stroke-[2]" />
            </button>
            <button 
              onClick={() => navigate('my-dashboard')}
              className="text-slate-400 hover:text-blue-600 active:scale-95 transition-colors p-1"
              title="Settings"
            >
              <Settings className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Ticket Confirmation Modal */}
        {ticketConfirmed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] max-w-xs w-full p-5 shadow-2xl border border-slate-100 relative text-center flex flex-col items-center">
              <button 
                onClick={() => setTicketConfirmed(null)}
                className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Flight Pass Ready</span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                {ticketConfirmed.airlineName} • {ticketConfirmed.price}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                From {ticketConfirmed.fromCity} ({ticketConfirmed.fromCode}) to {ticketConfirmed.toCity} ({ticketConfirmed.toCode})
              </p>

              <div className="w-full mt-4 space-y-2">
                <button
                  onClick={() => {
                    enrollSkill(role.id);
                    setTicketConfirmed(null);
                    navigate('course-modules', { roleId: role.id, skillId: skill.id });
                  }}
                  className="w-full py-2.5 bg-[#1864DB] hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-blue-500/25"
                >
                  Start Career Flight Now
                </button>
                <button
                  onClick={() => {
                    setTicketConfirmed(null);
                    setShowCartModal(true);
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold transition-all"
                >
                  View Cart & Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cart Modal */}
        <CartModal
          isOpen={showCartModal}
          onClose={() => setShowCartModal(false)}
        />

      </div>

    </div>
  );
}

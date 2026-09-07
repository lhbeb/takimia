'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ShieldCheck, Zap, HeartHandshake, MessageCircle } from 'lucide-react';

export default function LiveChatPage() {
  const [siteUrl, setSiteUrl] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin);
      // Small delay for entrance animation
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, []);

  const chatSrc = `https://chatapppay-rust.vercel.app/livechat?color=%232e3868&siteUrl=${encodeURIComponent(siteUrl || 'https://takimia.com')}`;

  return (
    <div className="min-h-[calc(100vh-140px)] w-full flex flex-col lg:flex-row bg-[#f8fafc] overflow-hidden">
      
      {/* Left Column: Creative Branding & Copy */}
      <div className="relative w-full lg:w-5/12 xl:w-1/2 bg-[#2e3868] text-white p-6 sm:p-8 lg:p-16 flex flex-col justify-between overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-blue-400/30 to-transparent blur-3xl" />
          <div className="absolute top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tl from-[#f5970c]/20 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div>
            <Link
              href="/"
              className="group mb-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-blue-100 transition-colors hover:text-white sm:mb-12"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Return to Store
            </Link>

            <div className={`transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100 sm:mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Agents Online Now
              </div>
              
              <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:mb-6 lg:text-6xl">
                We&apos;re here <br className="hidden lg:block" />to help you.
              </h1>
              
              <p className="mb-6 max-w-md text-base font-light leading-relaxed text-blue-100 sm:mb-12 sm:text-lg md:text-xl">
                Have a question about an espresso machine, precision grinder, barista accessories, or your recent order? Chat directly with our dedicated support team in real-time.
              </p>

              <a
                href="#live-chat"
                className="flex w-fit items-center gap-2 text-sm font-semibold text-[#f5970c] lg:hidden"
                aria-label="Scroll down to live chat"
              >
                Live chat below
                <ChevronDown className="h-5 w-5 motion-safe:animate-bounce" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className={`mt-auto hidden gap-6 transition-all duration-700 delay-200 lg:grid ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-lg backdrop-blur-sm">
                <Zap className="w-5 h-5 text-[#f5970c]" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Instant Responses</h3>
                <p className="text-sm text-blue-200">No waiting in lines. Get connected with a human agent instantly.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-lg backdrop-blur-sm">
                <ShieldCheck className="w-5 h-5 text-[#f5970c]" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Secure & Private</h3>
                <p className="text-sm text-blue-200">Your chat is fully encrypted and securely handled by Takimia.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-lg backdrop-blur-sm">
                <HeartHandshake className="w-5 h-5 text-[#f5970c]" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Real Human Support</h3>
                <p className="text-sm text-blue-200">We don&apos;t use frustrating bots. Chat with real experts who care.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Chat Widget */}
      <div id="live-chat" className="relative flex w-full scroll-mt-4 items-center justify-center p-3 sm:p-6 md:p-8 lg:w-7/12 lg:p-12 xl:w-1/2">
        {/* Abstract background blobs for right side */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#f5970c]/20 rounded-full blur-3xl" />

        <div className={`relative z-10 flex h-[75svh] min-h-[560px] w-full max-w-[500px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-blue-900/10 transition-all duration-700 delay-300 sm:h-[700px] sm:max-h-[80vh] sm:rounded-3xl ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}`}>
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between z-20">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-[#2e3868]/10 flex items-center justify-center text-[#2e3868]">
                  <MessageCircle className="w-5 h-5" />
               </div>
               <div>
                 <h2 className="font-semibold text-slate-800 text-sm">Takimia Live Support</h2>
                 <p className="text-xs text-slate-500">We typically reply in a few minutes</p>
               </div>
             </div>
          </div>
          
          <iframe
            src={chatSrc}
            title="Takimia Live Chat Support"
            className="w-full flex-grow border-none block"
            allow="clipboard-write; camera; microphone"
          />
        </div>
      </div>

    </div>
  );
}

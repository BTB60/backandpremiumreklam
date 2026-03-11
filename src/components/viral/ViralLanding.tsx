"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Play, 
  Clock, 
  Calculator, 
  Shield, 
  TrendingUp,
  CheckCircle,
  Zap,
  Award,
  Users,
  Star,
  ArrowRight,
  Smartphone,
  Receipt
} from "lucide-react";
import { useState } from "react";

// Before/After Comparison Component
function BeforeAfterCard() {
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB]">
        {/* Before */}
        <div className="p-6 bg-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
              ƏVVƏL
            </span>
          </div>
          <ul className="space-y-3 text-[#6B7280]">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✕</span>
              <span>WhatsApp-da sifariş qarışıqlığı</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✕</span>
              <span>Borc kimdə qaldı bilmirsən</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✕</span>
              <span>Qiymət hesablamada səhv</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✕</span>
              <span>Sifariş statusu bilinmir</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✕</span>
              <span>Vaxt itkisi</span>
            </li>
          </ul>
        </div>

        {/* After */}
        <div className="p-6 bg-[#16A34A]/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-[#16A34A] text-white rounded-full text-sm font-medium">
              SONRA
            </span>
          </div>
          <ul className="space-y-3 text-[#1F2937]">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[#16A34A] mt-0.5" />
              <span>Bir kliklə sifariş yarat</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[#16A34A] mt-0.5" />
              <span>Real-time borc nəzarəti</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[#16A34A] mt-0.5" />
              <span>Avtomatik qiymət hesablama</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[#16A34A] mt-0.5" />
              <span>Sifarişi izlə</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[#16A34A] mt-0.5" />
              <span>Gündə 1 saat vaxta qənaət</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

// Video Demo Section
function VideoDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);

  const videos = [
    {
      src: "/Create_a_short_promotional_video_for_an_advertising_company.____Scene_1___A_graphic_designer_working_seed3858181332.mp4",
      title: "Sürətli Baxış",
      duration: "60 saniyə"
    },
    {
      src: "/Create_a_short_promotional_video_for_an_advertising_company.____Scene_1___A_graphic_designer_working_seed4096509074.mp4",
      title: "Dizayn Prosesi",
      duration: "45 saniyə"
    }
  ];

  return (
    <div className="relative">
      <div className="aspect-video rounded-2xl overflow-hidden bg-gray-900 relative">
        {!isPlaying ? (
          /* Thumbnail */
          <div className="absolute inset-0 bg-gradient-to-br from-[#D90429]/20 to-[#EF476F]/20 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(true)}
              className="w-20 h-20 rounded-full bg-[#D90429] text-white flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Play className="w-8 h-8 ml-1" />
            </button>
          </div>
        ) : (
          /* Video Player */
          <video
            key={activeVideo}
            className="w-full h-full object-cover"
            controls
            autoPlay
            muted
            loop
          >
            <source src={videos[activeVideo].src} type="video/mp4" />
            Brauzeriniz video dəstəkləmir.
          </video>
        )}
      </div>
      
      {/* Video Selector */}
      {isPlaying && (
        <div className="flex justify-center gap-3 mt-4">
          {videos.map((video, index) => (
            <button
              key={index}
              onClick={() => setActiveVideo(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeVideo === index
                  ? "bg-[#D90429] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {video.title}
            </button>
          ))}
        </div>
      )}
      
      {/* Video Stats */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm text-[#6B7280]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{videos[activeVideo].duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4" />
          <span>10K+ baxış</span>
        </div>
      </div>
    </div>
  );
}

// Feature Cards for TikTok/Short attention span
function QuickFeatures() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "30 saniyədə sifariş",
      description: "3 addımlıq sürətli proses",
    },
    {
      icon: <Receipt className="w-6 h-6" />,
      title: "Borc nəzarəti",
      description: "Real-time balans izləmə",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobil dostluq",
      description: "Hər yerdən sifariş ver",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Bonus sistemi",
      description: "Hər sifarişdən bonus qazan",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="h-full text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#D90429]/10 flex items-center justify-center text-[#D90429]">
              {feature.icon}
            </div>
            <h4 className="font-bold text-[#1F2937] text-sm mb-1">{feature.title}</h4>
            <p className="text-xs text-[#6B7280]">{feature.description}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Social Proof for Viral Effect
function SocialProof() {
  const stats = [
    { value: "500+", label: "Aktiv Dekorçu" },
    { value: "10K+", label: "Tamamlanmış Sifariş" },
    { value: "4.9", label: "Reytinq" },
    { value: "50K+", label: "Yüklənmə" },
  ];

  return (
    <div className="bg-[#1F2937] rounded-2xl p-6 text-white">
      <div className="grid grid-cols-4 gap-4 text-center">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-2xl font-bold text-[#D90429] font-[Manrope]">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Viral Landing Component
export function ViralLanding() {
  return (
    <div className="space-y-8">
      {/* Hero Section - TikTok Style */}
      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#D90429]/10 text-[#D90429] rounded-full text-sm font-medium mb-6"
        >
          <Zap className="w-4 h-4" />
          <span>Reklamçılar üçün #1 Sistem</span>
        </motion.div>
        
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1F2937] mb-4 font-[Manrope]">
          Sifarişini <span className="text-[#D90429]">30 saniyəyə</span> yarat
        </h1>
        
        <p className="text-lg text-[#6B7280] max-w-xl mx-auto mb-6">
          Dekorçular üçün hazırlanmış professional sifariş sistemi. 
          Borc nəzarəti, avtomatik hesablama, bonuslar.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register">
            <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Pulsuz Başla
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="secondary" size="lg" icon={<Play className="w-5 h-5" />}>
              Marketplace
            </Button>
          </Link>
        </div>
      </section>

      {/* Video Demo */}
      <VideoDemo />

      {/* Quick Features */}
      <QuickFeatures />

      {/* Before/After */}
      <section>
        <h2 className="text-2xl font-bold text-[#1F2937] text-center mb-6 font-[Manrope]">
          Fərqi Gör
        </h2>
        <BeforeAfterCard />
      </section>

      {/* Social Proof */}
      <SocialProof />

      {/* CTA */}
      <Card className="bg-gradient-to-br from-[#D90429] to-[#EF476F] text-white text-center border-none">
        <h2 className="text-2xl font-bold mb-2 font-[Manrope]">
          İlk Sifarişinə 10% Endirim
        </h2>
        <p className="text-white/80 mb-4">
          İlk 100 dekorçuya xüsusi təklif. Tələsin!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="secondary" className="bg-white text-[#D90429] border-none">
            Qeydiyyatdan Keç
          </Button>
        </div>
        <p className="text-white/60 text-sm mt-4">
          Kredit kartı tələb olunmur • Pulsuz başla
        </p>
      </Card>
    </div>
  );
}

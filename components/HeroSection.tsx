// // components/HeroSection.tsx
// 'use client';

// import Link from 'next/link';
// import { Play, Search, Sparkles } from 'lucide-react';

// export function HeroSection() {
//   return (
//     <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
//       {/* Animated Background Gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_50%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.1),transparent_50%)]" />
//       </div>

//       {/* Animated Grid Pattern */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]" />

//       {/* Floating Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
//       </div>

//       {/* Content */}
//       <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="max-w-4xl mx-auto text-center space-y-8">
          
//           {/* Badge */}
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 backdrop-blur-sm">
//             <Sparkles className="w-4 h-4 text-red-500" />
//             <span className="text-sm font-medium text-red-300">
//               Powered by TMDB
//             </span>
//           </div>

//           {/* Main Heading */}
//           <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
//             <span className="block bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
//               Discover Your Next
//             </span>
//             <span className="block mt-2 bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent">
//               Favorite Movie
//             </span>
//           </h1>

//           {/* Description */}
//           <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
//             Explore millions of movies and TV shows. Get personalized recommendations, 
//             watch trailers, and discover what's trending worldwide.
//           </p>

//           {/* CTA Buttons */}
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
//             <Link
//               href="/#trending"
//               className="group relative w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
//             >
//               <span className="relative z-10 flex items-center justify-center gap-2">
//                 <Play className="w-5 h-5" />
//                 Start Watching
//               </span>
//               <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//             </Link>

//             <Link
//               href="/search"
//               className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
//             >
//               <span className="flex items-center justify-center gap-2">
//                 <Search className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
//                 Advanced Search
//               </span>
//             </Link>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
//             <div className="space-y-1">
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
//                 1M+
//               </div>
//               <div className="text-sm text-slate-500">
//                 Movies
//               </div>
//             </div>
//             <div className="space-y-1">
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
//                 500K+
//               </div>
//               <div className="text-sm text-slate-500">
//                 TV Shows
//               </div>
//             </div>
//             <div className="space-y-1">
//               <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
//                 Daily
//               </div>
//               <div className="text-sm text-slate-500">
//                 Updates
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Gradient Fade */}
//       <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
//     </section>
//   );
// }
"use client";
import { ArrowRight, Award, BookOpen, Globe, Play, Users } from "lucide-react";
// Update the import path below if Button is located elsewhere, for example:

// Or, if you have a UI library, import from there:
// import { Button } from "@your-ui-library/button";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  className = "",
  children,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium focus:outline-none transition";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    outline:
      "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Simple Star icon for the trust badge
const Star = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M10 15.27L16.18 18l-1.64-7.03L19 7.24l-7.19-.61L10 0 8.19 6.63 1 7.24l5.46 3.73L4.82 18z" />
  </svg>
);
const Banner = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Simple Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fillRule='evenodd'%3e%3cg fill='%23000000' fillOpacity='1'%3e%3ccircle cx='7' cy='7' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-40 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-10">
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm border border-blue-100 rounded-full px-6 py-3 shadow-sm">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="text-base font-medium text-gray-700">
                Trusted by 50,000+ Students
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight">
                Find Your
                <span className="block text-blue-600">Dream University</span>
              </h1>
              <p className="text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Connect with top universities worldwide and get expert guidance
                to shape your academic future.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center">
                <span>Start Your Journey</span>
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-5 rounded-xl text-xl font-semibold transition-all duration-300 flex items-center bg-transparent"
              >
                <Play className="mr-3 h-6 w-6" />
                <span>Watch Demo</span>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">500+</div>
                <div className="text-lg text-gray-600 mt-2">Universities</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">50+</div>
                <div className="text-lg text-gray-600 mt-2">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">98%</div>
                <div className="text-lg text-gray-600 mt-2">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Elements */}
          <div className="relative">
            <div className="relative max-w-2xl mx-auto">
              {/* Main Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-8">
                  <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        University Match
                      </h3>
                      <p className="text-base text-gray-600">
                        Find your perfect fit
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-600">
                        Match Score
                      </span>
                      <span className="text-base font-semibold text-blue-600">
                        95%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full w-[95%]"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-5 bg-blue-50 rounded-2xl">
                      <div className="text-2xl font-bold text-blue-600">
                        4.8
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Rating</div>
                    </div>
                    <div className="text-center p-5 bg-blue-50 rounded-2xl">
                      <div className="text-2xl font-bold text-blue-600">
                        $45K
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Tuition</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 -left-8 bg-white rounded-2xl shadow-lg p-5 animate-bounce">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      Top Ranked
                    </div>
                    <div className="text-sm text-gray-600">
                      #1 in Engineering
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-lg p-5 animate-bounce"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      50K+ Students
                    </div>
                    <div className="text-sm text-gray-600">
                      Global Community
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute top-1/2 -right-16 bg-white rounded-2xl shadow-lg p-5 animate-bounce"
                style={{ animationDelay: "2s" }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Globe className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      Global Reach
                    </div>
                    <div className="text-sm text-gray-600">50+ Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Banner;

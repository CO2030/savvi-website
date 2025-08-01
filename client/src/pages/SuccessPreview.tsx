import { CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Development-only preview of the success page
// This allows easy testing and text editing without registration
export default function SuccessPreview() {
  const handleDownload = () => {
    // Mock download for preview purposes
    console.log('Download clicked - this is preview mode');
    window.open('/5-day-meals-guide.pdf', '_blank');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: '#399E5A' }}>
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          You're All Set!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
          Your <strong>5-Day Healthy Meals Guide</strong> is being prepared and will be delivered to your inbox within the next few minutes.
        </p>

        {/* Download Button */}
        <div className="mb-8">
          <Button 
            onClick={handleDownload}
            className="text-white px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity duration-200 shadow-lg"
            style={{ backgroundColor: '#399E5A' }}
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF Guide
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            Download instantly + check your email for the secure online version
          </p>
        </div>

        {/* Development Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Development Preview:</strong> This is a preview of the success page for easy editing. 
            Real users access this page after registration with secure tokens.
          </p>
        </div>

        {/* Combined Sharing & Referral Campaign */}
        <div className="border-2 rounded-xl p-6 mb-8" style={{ backgroundColor: '#EFD8D0', borderColor: '#D4B5A8' }}>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-3 text-black">
              🎉 Want FREE Early Access to Our AI Wellness Tool?
            </h3>
            <p className="text-lg mb-4 text-black">
              <strong>First 100 people who refer 3 friends get free early access!</strong>
            </p>
            <p className="text-sm mb-6 text-black">
              Share this free guide with friends and unlock exclusive early access to our AI nutrition assistant.
            </p>
            
            {/* Direct Sharing Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                style={{ borderColor: '#399E5A', color: '#399E5A' }}
                onClick={() => console.log('Copy clicked - preview mode')}
              >
                <Download className="w-4 h-4" />
                Copy Link
              </Button>
              <Button 
                variant="outline"
                className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                onClick={() => console.log('Facebook clicked - preview mode')}
              >
                <Download className="w-4 h-4" />
                Facebook
              </Button>
              <Button 
                variant="outline"
                className="flex items-center gap-2 text-blue-400 border-blue-400 hover:bg-blue-50"
                onClick={() => console.log('Twitter clicked - preview mode')}
              >
                <Download className="w-4 h-4" />
                Twitter
              </Button>
              <Button 
                variant="outline"
                className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => console.log('WhatsApp clicked - preview mode')}
              >
                <Download className="w-4 h-4" />
                WhatsApp
              </Button>
            </div>
            
            {/* CTA for detailed tracking */}
            <div className="space-y-4">
              <div>
                <Button 
                  className="text-white px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity duration-200 shadow-lg"
                  style={{ backgroundColor: '#399E5A' }}
                  onClick={() => console.log('Referral links clicked - preview mode')}
                >
                  Get Your Personalized Referral Links →
                </Button>
                <p className="text-xs mt-2 text-black">
                  Access your meal guide for trackable referral links to earn free access
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="rounded-lg p-6 mb-8" style={{ backgroundColor: '#399E5A20' }}>
          <h3 className="text-xl font-semibold mb-3" style={{ color: '#399E5A' }}>What's Next?</h3>
          <ul className="space-y-2 text-left max-w-md mx-auto" style={{ color: '#399E5A' }}>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: '#399E5A' }} />
              Check your email (including spam folder)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: '#399E5A' }} />
              Download your meal planning guide
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: '#399E5A' }} />
              Share with friends to earn free early access
            </li>
          </ul>
        </div>

        {/* Navigation for development */}
        <div className="border-t pt-6">
          <p className="text-sm text-gray-500">
            <a href="/5-day-meals" className="text-blue-600 hover:underline">← Back to signup form</a>
            {" | "}
            <a href="/meal-guide" className="text-blue-600 hover:underline">Real token-protected meal guide →</a>
          </p>
        </div>
      </div>
    </div>
  );
}
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-sm max-w-none space-y-6 text-foreground">
          <div>
            <p className="text-sm text-muted-foreground">Last updated: December 24, 2025</p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              LinkedIn Post Generation (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the postgeneration.vercel.app website (the &quot;Site&quot;). 
              This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Site and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">2.1 Authentication Data</h3>
            <p>
              When you sign in with LinkedIn, we collect and store your basic profile information including:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Email address</li>
              <li>Name</li>
              <li>LinkedIn ID</li>
              <li>Profile picture (if available)</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">2.2 Generated Content</h3>
            <p>
              We store LinkedIn posts and calendar ideas that you create using our service. This data is associated with your account and is used to provide you with the ability to manage, edit, and share your content.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">2.3 Usage Data</h3>
            <p>
              We may collect information about how the Site is accessed and used, including browser type, IP address, pages visited, and time spent on pages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Use of Data</h2>
            <p>LinkedIn Post Generation uses the collected data for various purposes:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Services</h2>
            <p>
              Our application uses third-party services that may collect information used to identify you:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li><strong>Supabase</strong> - for authentication and data storage (Privacy Policy: https://supabase.com/privacy)</li>
              <li><strong>OpenAI</strong> - for content generation (Privacy Policy: https://openai.com/privacy)</li>
              <li><strong>LinkedIn</strong> - for OAuth authentication (Privacy Policy: https://www.linkedin.com/legal/privacy-policy)</li>
              <li><strong>Vercel</strong> - for hosting (Privacy Policy: https://vercel.com/legal/privacy-policy)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Security of Data</h2>
            <p>
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our website.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

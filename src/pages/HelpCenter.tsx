import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { LifeBuoy, Mail, Phone } from 'lucide-react';

const HelpCenter = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !description.trim()) {
      toast({
        title: 'Missing details',
        description: 'Please fill in your name, email, and description.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const subject = encodeURIComponent(`Help Center enquiry from ${name.trim()}`);
    const body = encodeURIComponent(
      [
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Phone: ${phone.trim() || 'Not provided'}`,
        '',
        description.trim(),
      ].join('\n')
    );

    window.location.href = `mailto:Support@triphavenco.com?subject=${subject}&body=${body}`;
    toast({
      title: 'Opening your email app',
      description: 'Your message is ready to send to Support@triphavenco.com.',
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 sm:py-14">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[#1A8491] text-xs font-bold mb-3">
            <LifeBuoy className="w-3.5 h-3.5" />
            Help Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-gray-900 tracking-tight mb-2">
            How can we help?
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Send us a note and our team will get back to you. Prefer a direct line? Visit{' '}
            <Link to="/contact" className="text-[#1A8491] font-semibold hover:underline">
              Contact Us
            </Link>
            .
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8 shadow-xs space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="help-name">Name</Label>
            <Input
              id="help-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="help-email">Email</Label>
            <Input
              id="help-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="help-phone">Phone</Label>
            <Input
              id="help-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 ..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="help-description">Description</Label>
            <Textarea
              id="help-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what you need help with"
              className="min-h-[140px]"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-[#1A8491] hover:bg-[#15707A]"
          >
            {isSubmitting ? 'Preparing…' : 'Submit enquiry'}
          </Button>
        </form>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 text-sm text-gray-600">
          <a
            href="mailto:Support@triphavenco.com"
            className="inline-flex items-center gap-2 text-[#1A8491] font-medium hover:underline"
          >
            <Mail className="w-4 h-4" />
            Support@triphavenco.com
          </a>
          <a
            href="tel:+918129111291"
            className="inline-flex items-center gap-2 text-[#1A8491] font-medium hover:underline"
          >
            <Phone className="w-4 h-4" />
            +91 8129111291
          </a>
        </div>
      </main>
    </div>
  );
};

export default HelpCenter;

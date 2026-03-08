import { Link } from 'react-router-dom';

export default function DataHandling() {
  return (
    <div className="space-y-8 fade-in max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-foreground">How BabyAdmin handles your data</h1>

      <section className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          BabyAdmin was created to help expecting parents navigate the administrative steps around pregnancy and birth in Germany. Respecting your privacy is important to us, and we want to be transparent about how your information is used.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">What BabyAdmin stores</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          BabyAdmin stores a small amount of information to make the app work for you:
        </p>
        <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-1">
          <li>Your task progress (which steps you have completed)</li>
          <li>Your estimated due date</li>
          <li>Basic account login information (email address)</li>
        </ul>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This information is used to save your progress and personalize the timeline to your pregnancy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">What BabyAdmin does not store</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          BabyAdmin does not ask you to upload or store personal documents. No passports, birth certificates, marriage certificates, insurance documents or other sensitive files are collected or kept by the app.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">How your information is used</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your data is only used to make the app function. It is not sold, shared with advertisers or used for any purpose beyond providing you with a working timeline and progress tracker.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Why an account is needed</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Creating an account simply allows BabyAdmin to remember your progress across sessions. Without it, your completed tasks and settings would be lost each time you close the app.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Contact</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If you have any questions about how your data is handled, you can reach us at{' '}
          <a href="mailto:hello@babyadmin.app" className="text-primary hover:underline">hello@babyadmin.app</a>.
        </p>
      </section>
    </div>
  );
}

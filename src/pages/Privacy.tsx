import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="space-y-6 fade-in max-w-xl">
      <h1 className="text-2xl font-bold text-foreground">Privacy policy</h1>

      <section className="space-y-2 text-sm text-muted-foreground leading-relaxed">
        <p className="font-medium text-foreground">1. Data controller</p>
        <p>Angela Gomez Sanchez</p>
        <p>Email: hello@babyadmin.app</p>
      </section>

      <section className="space-y-2 text-sm text-muted-foreground leading-relaxed">
        <p className="font-medium text-foreground">2. Data collected</p>
        <p>When you create an account and use BabyAdmin, the following data may be processed:</p>
        <ul className="list-disc list-inside space-y-1 pl-1">
          <li>email address</li>
          <li>authentication data</li>
          <li>app usage data required to save progress</li>
          <li>task and checklist completion state</li>
          <li>due date or timeline-related state entered by the user</li>
        </ul>
      </section>

      <section className="space-y-2 text-sm text-muted-foreground leading-relaxed">
        <p className="font-medium text-foreground">3. Purpose of processing</p>
        <p>The data is processed only to provide the functionality of the BabyAdmin application, including:</p>
        <ul className="list-disc list-inside space-y-1 pl-1">
          <li>account creation and login</li>
          <li>saving progress across sessions and devices</li>
          <li>showing the correct pregnancy or postpartum timeline</li>
          <li>providing user-requested features of the app</li>
        </ul>
      </section>

      <section className="space-y-2 text-sm text-muted-foreground leading-relaxed">
        <p className="font-medium text-foreground">4. Legal basis</p>
        <p>
          Processing is based on Article 6(1)(b) GDPR, because the data is necessary to provide the service requested by the user.
        </p>
      </section>

      <section className="space-y-2 text-sm text-muted-foreground leading-relaxed">
        <p className="font-medium text-foreground">5. Storage and deletion</p>
        <p>Data is stored only for as long as necessary to operate the service.</p>
        <p>Users may request deletion of their account and associated data.</p>
      </section>

      <section className="space-y-2 text-sm text-muted-foreground leading-relaxed">
        <p className="font-medium text-foreground">6. Third-party services</p>
        <p>
          BabyAdmin may use third-party infrastructure providers to host and operate the application, including hosting, database, authentication, and email delivery providers.
        </p>
      </section>

      <section className="space-y-2 text-sm text-muted-foreground leading-relaxed">
        <p className="font-medium text-foreground">7. User rights</p>
        <p>
          Users have the right to request access, correction, deletion, restriction of processing, and data portability under applicable data protection law.
        </p>
      </section>

      <section className="space-y-2 text-sm text-muted-foreground leading-relaxed">
        <p className="font-medium text-foreground">8. Contact</p>
        <p>For privacy-related questions, contact:</p>
        <p>hello@babyadmin.app</p>
      </section>

      <div className="pt-4">
        <Link to="/" className="text-sm text-primary hover:text-primary/80 transition-colors">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}

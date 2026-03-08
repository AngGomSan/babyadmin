import { Link } from 'react-router-dom';

export default function Impressum() {
  return (
    <div className="space-y-6 fade-in max-w-xl">
      <h1 className="text-2xl font-bold text-foreground">Impressum</h1>

      <section className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p className="font-medium text-foreground">Angaben gemäß § 5 TMG</p>

        <div>
          <p className="font-medium text-foreground">Name</p>
          <p>Angela Gomez Sanchez</p>
        </div>

        <div>
          <p className="font-medium text-foreground">Address</p>
          <p>Thomasiusstr. 11</p>
          <p>10557, Berlin</p>
          <p>Germany</p>
        </div>

        <div>
          <p className="font-medium text-foreground">Contact</p>
          <p>Email: hello@babyadmin.app</p>
        </div>

        <div>
          <p className="font-medium text-foreground">Responsible for content</p>
          <p>Angela Gomez Sanchez</p>
        </div>
      </section>

      <section className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p className="font-medium text-foreground">Disclaimer</p>
        <p>
          BabyAdmin provides organizational guidance related to pregnancy, birth and the months that follow. The information provided does not replace medical, legal, or tax advice.
        </p>
      </section>

      <section className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p className="font-medium text-foreground">Haftungsausschluss</p>
        <p>
          Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.
        </p>
        <p>
          BabyAdmin stellt organisatorische Informationen rund um Schwangerschaft, Geburt und die Zeit danach bereit. Die Inhalte ersetzen keine medizinische, rechtliche oder steuerliche Beratung.
        </p>
      </section>

      <div className="pt-4">
        <Link to="/" className="text-sm text-primary hover:text-primary/80 transition-colors">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}

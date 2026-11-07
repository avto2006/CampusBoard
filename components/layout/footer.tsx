export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-6">
      <div className="container mx-auto flex flex-col gap-2 text-sm text-muted-foreground px-4">
        <p>
          Information is aggregated from public university sources. Each listing links to its original source, where the organizer's details are authoritative.
        </p>
        <p>
          Organizers who want a listing removed or corrected can{" "}
          <a href="#contact" className="font-medium text-foreground underline">
            contact us
          </a>
          .
        </p>
        <p>© 2026 CampusBoard</p>
      </div>
    </footer>
  );
}
export default function Footer() {
  return (
    <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 p-10 text-center text-sm">
      <span>
        Design & Developed by <span className="font-semibold">Sourav Khan</span>
      </span>
      <span>© {new Date().getFullYear()}. All rights reserved.</span>
    </div>
  );
}

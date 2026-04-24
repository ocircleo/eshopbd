import { Navbar } from '@/components/Navbar'

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-card border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 EShopBD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
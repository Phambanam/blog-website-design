import Header from "@/components/blog/header"
import Footer from "@/components/blog/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="max-w-3xl mx-auto px-4 md:px-8 py-12">
          <div className="space-y-12">
            {/* About Section */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-foreground">About Me</h1>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  I'm a passionate web developer and designer with a love for creating beautiful, functional digital
                  experiences. With over 5 years of experience in the industry, I've worked on projects ranging from
                  startups to enterprise applications.
                </p>
                <p>
                  My expertise spans across modern web technologies including React, Next.js, TypeScript, and Tailwind
                  CSS. I'm particularly interested in building performant, accessible, and user-friendly applications.
                </p>
                <p>
                  When I'm not coding, you can find me exploring new design trends, contributing to open-source
                  projects, or sharing knowledge through writing and speaking at tech meetups.
                </p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Skills & Expertise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-foreground mb-3">Frontend</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• React & Next.js</li>
                      <li>• TypeScript</li>
                      <li>• Tailwind CSS</li>
                      <li>• UI/UX Design</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-foreground mb-3">Backend</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Node.js</li>
                      <li>• PostgreSQL</li>
                      <li>• REST APIs</li>
                      <li>• Database Design</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

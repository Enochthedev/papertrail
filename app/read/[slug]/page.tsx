import { ReaderPage } from "@/components/reader-page"

export default function Read({ params }: { params: { slug: string } }) {
  return <ReaderPage slug={params.slug} />
}

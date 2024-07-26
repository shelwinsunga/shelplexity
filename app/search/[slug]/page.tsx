export default function Page({ params }: { params: { slug: string } }) {
    return <div>{params.slug}</div>
  }
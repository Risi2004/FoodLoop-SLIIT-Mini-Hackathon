export default function PageStub({ title, description }) {
  return (
    <div className="page">
      <section className="page-stub">
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </div>
  )
}

export default function About() {
  return (
    <div className="container-prose py-10">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Quem somos</p>
        <h1 className="mt-1 text-3xl font-bold text-ink-900 md:text-4xl">Sobre o Blog dos Gatos</h1>
      </header>

      <div className="prose-blog space-y-4 text-ink-700">
        <p>
          O Blog dos Gatos nasceu da paixão por esses animais fascinantes. Nossa missão é oferecer conteúdo confiável, claro e amigável sobre cuidados, alimentação, saúde, raças, comportamento, curiosidades e adoção de gatos — tudo em português.
        </p>
        <h2>Nossa missão</h2>
        <p>
          Ajudar tutores a proporcionar uma vida feliz e saudável aos seus gatos, com informações baseadas em conhecimento veterinário e experiência prática.
        </p>
        <h2>O que você encontra aqui</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Guias completos de cuidados para cada fase da vida do gato</li>
          <li>Informações sobre alimentação, saúde e prevenção de doenças</li>
          <li>Perfis de raças e suas características</li>
          <li>Dicas de comportamento e enriquecimento ambiental</li>
          <li>Curiosidades que vão te surpreender</li>
          <li>Orientações sobre adoção responsável</li>
        </ul>
        <h2>Compromisso com a qualidade</h2>
        <p>
          Todo conteúdo é revisado e atualizado regularmente. Em caso de dúvidas específicas sobre a saúde do seu gato, recomendamos sempre a consulta a um médico veterinário.
        </p>
      </div>
    </div>
  )
}

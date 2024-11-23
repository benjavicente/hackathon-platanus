import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lecciones/')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /lecciones!'
}

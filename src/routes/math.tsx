import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/math')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /math!'
}

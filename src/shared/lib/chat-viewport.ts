export function chatDrawerBounds(restingHeight: number, visibleHeight: number, offsetTop = 0, expanded = false) {
  const height = expanded ? visibleHeight : Math.min(restingHeight * .7, Math.max(0, visibleHeight - 8))
  return { height, top: offsetTop + visibleHeight - height }
}

export function shouldDismissChatDrawer(distance: number, velocity: number, height: number) {
  return distance > Math.min(100, height * .2) || (distance > 28 && velocity > .6)
}

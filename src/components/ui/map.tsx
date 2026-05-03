"use client"

import * as React from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import { cn } from "@/lib/utils"

export interface MapProps extends React.HTMLAttributes<HTMLDivElement> {
  options?: Partial<maplibregl.MapOptions>
  onMapLoad?: (map: maplibregl.Map) => void
}

const Map = React.forwardRef<HTMLDivElement, MapProps>(
  ({ className, options, onMapLoad, ...props }, ref) => {
    const mapContainerRef = React.useRef<HTMLDivElement>(null)
    const mapRef = React.useRef<maplibregl.Map | null>(null)

    React.useImperativeHandle(ref, () => mapContainerRef.current as HTMLDivElement)

    React.useEffect(() => {
      if (!mapContainerRef.current) return

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [120.9842, 14.5995], // Default to Manila for context
        zoom: 12,
        ...options,
      })

      mapRef.current = map

      map.on("load", () => {
        onMapLoad?.(map)
      })

      return () => {
        map.remove()
      }
    }, [options, onMapLoad])

    return (
      <div
        ref={mapContainerRef}
        className={cn("h-full w-full rounded-xl overflow-hidden", className)}
        {...props}
      />
    )
  }
)
Map.displayName = "Map"

export { Map }

"use client";

import Image from "next/image";
import { Lavishly_Yours } from "next/font/google";
import React, { CSSProperties } from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { cn } from "@/lib/utils";

const lavishlyYours = Lavishly_Yours({ weight: "400", subsets: ["latin"], display: "swap" });

// Base physical dimensions (in pixels at 96dpi)
const BASE_TOTAL_WIDTH = Math.round(3.483 * 96);
const BASE_TOTAL_HEIGHT = Math.round(4.233 * 96);
const BASE_PHOTO_WIDTH = Math.round(3.024 * 96);
const BASE_PHOTO_HEIGHT = Math.round(3.108 * 96);
const BASE_SIDE_MARGIN = Math.round((BASE_TOTAL_WIDTH - BASE_PHOTO_WIDTH) / 2);
const BASE_TOP_MARGIN = Math.round(0.162 * 96);
const BASE_BOTTOM_MARGIN = Math.round(((BASE_TOTAL_HEIGHT - BASE_PHOTO_HEIGHT - BASE_TOP_MARGIN) / 2) * 0.5);
const BASE_TITLE_MARGIN_TOP = 30;

export interface PolaroidCardProps {
  imageUrl: string;
  title?: string;
  imagePosition?: string;
  imageStyle?: CSSProperties;
  className?: string;
  style?: CSSProperties;
  scale?: number;
}

const PolaroidCard: React.FC<PolaroidCardProps> = ({
  imageUrl,
  title = "Polaroid",
  imagePosition = "center",
  imageStyle,
  className,
  style,
  scale = 1,
}) => {
  const totalWidth = Math.round(BASE_TOTAL_WIDTH * scale);
  const totalHeight = Math.round(BASE_TOTAL_HEIGHT * scale);
  const photoWidth = Math.round(BASE_PHOTO_WIDTH * scale);
  const photoHeight = Math.round(BASE_PHOTO_HEIGHT * scale);
  const sideMargin = Math.round(BASE_SIDE_MARGIN * scale);
  const topMargin = Math.round(BASE_TOP_MARGIN * scale);
  const bottomMargin = Math.max(20, Math.round(BASE_BOTTOM_MARGIN * scale));
  const titleMarginTop = Math.round(BASE_TITLE_MARGIN_TOP * scale);

  return (
    <DraggableCardContainer className="relative flex items-center justify-center">
      <DraggableCardBody
        className={cn(
          "flex flex-col items-center justify-start bg-white shadow-[0_14px_32px_rgba(15,23,42,0.18)]",
          className,
        )}
        style={{
          width: totalWidth,
          minHeight: totalHeight,
          paddingLeft: sideMargin,
          paddingRight: sideMargin,
          paddingTop: topMargin,
          paddingBottom: bottomMargin,
          ...style,
        }}
      >
        <div
          className="w-full overflow-hidden"
          style={{
            width: photoWidth,
            height: photoHeight,
            boxShadow: "inset 0 0 0 1px rgba(148,163,184,0.14)",
            backgroundColor: "#ffffff",
          }}
        >
          <Image
            src={imageUrl}
            alt={title}
            width={photoWidth}
            height={photoHeight}
            priority={false}
            className="pointer-events-none h-full w-full object-cover"
            style={{ objectFit: "cover", objectPosition: imagePosition, ...imageStyle }}
          />
        </div>

        <span
          className={cn(lavishlyYours.className, "select-none text-4xl")}
          style={{
            color: "#111827",
            textShadow: "0 3px 8px rgba(15,23,42,0.25)",
            marginTop: titleMarginTop,
          }}
        >
          {title}
        </span>
      </DraggableCardBody>
    </DraggableCardContainer>
  );
};

export default PolaroidCard;

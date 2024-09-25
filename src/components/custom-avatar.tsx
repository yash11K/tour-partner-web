import { type FC, memo } from "react";

import type { AvatarProps } from "antd";
import { Avatar as AntdAvatar } from "antd";

import { getNameInitials, getRandomColorFromString } from "@/utilities";

type Props = AvatarProps & {
  name?: string;
  objectFit?: 'contain' | 'cover';
};

const CustomAvatarComponent: FC<Props> = ({ name = "", style, objectFit = 'contain', src, ...rest }) => {
  const bgColor = src ? "transparent" : getRandomColorFromString(name);

  return (
    <AntdAvatar
      alt={name}
      size="small"
      style={{
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      {src ? (
        <img
          src={src as string}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: objectFit,
          }}
        />
      ) : (
        getNameInitials(name)
      )}
    </AntdAvatar>
  );
};

export const CustomAvatar = memo(
  CustomAvatarComponent,
  (prevProps, nextProps) => {
    return prevProps.name === nextProps.name && prevProps.src === nextProps.src && prevProps.objectFit === nextProps.objectFit;
  },
);

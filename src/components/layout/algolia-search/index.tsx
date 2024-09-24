import { type FC, useState } from "react";
import { useHits, useSearchBox } from "react-instantsearch";
import { Link } from "react-router-dom";


import { SearchOutlined } from "@ant-design/icons";
import { Input, List, Popover, Tag, Typography } from "antd";
import cn from "classnames";


import { CustomAvatar } from "../../custom-avatar";
import styles from "./index.module.css";

export const AlgoliaSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { query, refine } = useSearchBox();
  const [inputValue, setInputValue] = useState(query);

  const setQuery = (newQuery: string) => {
    setInputValue(newQuery);
    refine(newQuery);
  };

  return (
    <div className={styles.container}>
      <Popover
        overlayClassName={styles.popover}
        trigger="click"
        open={!!inputValue || open}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <Input
          className={styles.input}
          size="large"
          prefix={
            // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            <SearchOutlined
              className={cn(styles.inputPrefix, "secondary", "tertiary")}
            />
          }
          suffix={<div className={styles.inputSuffix}>/</div>}
          placeholder="Search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={512}
          type="search"
          value={inputValue}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
          }}
        />
      </Popover>
    </div>
  );
};
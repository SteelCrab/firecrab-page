import React, {useId, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import {useCodeBlockContext} from '@docusaurus/theme-common/internal';
import Container from '@theme/CodeBlock/Container';
import Title from '@theme/CodeBlock/Title';
import Content from '@theme/CodeBlock/Content';
import Buttons from '@theme/CodeBlock/Buttons';
import Button from '@theme/CodeBlock/Buttons/Button';
import type {Props} from '@theme/CodeBlock/Layout';

import styles from './styles.module.css';

function toggleLabel(isCollapsed: boolean): string {
  return isCollapsed
    ? translate({
        id: 'theme.CodeBlock.expandButtonAriaLabel',
        message: '코드 펼치기',
        description: '접힌 코드 블록을 펼치는 버튼의 라벨',
      })
    : translate({
        id: 'theme.CodeBlock.collapseButtonAriaLabel',
        message: '코드 접기',
        description: '열린 코드 블록을 접는 버튼의 라벨',
      });
}

export default function CodeBlockLayout({className}: Props): ReactNode {
  const {metadata} = useCodeBlockContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const bodyId = useId();
  const label = toggleLabel(isCollapsed);

  return (
    <Container as="div" className={clsx(className, metadata.className)}>
      {metadata.title && (
        <div className={styles.codeBlockTitle}>
          <Title>{metadata.title}</Title>
        </div>
      )}
      <div className={styles.codeBlockContent}>
        <Button
          aria-controls={bodyId}
          aria-expanded={!isCollapsed}
          aria-label={label}
          className={styles.collapseButton}
          onClick={() => setIsCollapsed((collapsed) => !collapsed)}
          title={label}>
          <svg
            aria-hidden="true"
            className={clsx(
              styles.collapseIcon,
              isCollapsed && styles.collapseIconCollapsed,
            )}
            viewBox="0 0 20 20">
            <path d="m5.5 7.5 4.5 4.5 4.5-4.5" />
          </svg>
        </Button>
        <div
          className={clsx(
            styles.codeBlockBody,
            isCollapsed && styles.codeBlockBodyCollapsed,
          )}
          id={bodyId}>
          <div className={styles.codeBlockBodyInner}>
            <Content />
          </div>
        </div>
        <Buttons />
      </div>
    </Container>
  );
}

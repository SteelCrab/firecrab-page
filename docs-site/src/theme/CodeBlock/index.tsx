// swizzle --wrap: 모든 fenced code block에 줄번호를 기본으로 표시한다.
// 개별 블록에서 showLineNumbers={false}를 전달하면 명시적인 설정을 우선한다.
import type {ReactNode} from 'react';
import OriginalCodeBlock from '@theme-original/CodeBlock';
import type CodeBlockType from '@theme/CodeBlock';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof CodeBlockType>;

export default function CodeBlockWrapper({
  showLineNumbers = true,
  ...props
}: Props): ReactNode {
  return <OriginalCodeBlock {...props} showLineNumbers={showLineNumbers} />;
}

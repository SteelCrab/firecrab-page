// eject: 원본은 연도(YYYY)로만 묶는다. 그룹 제목에 월까지 표시한다.
import {memo, type ReactNode} from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import type {Props} from '@theme/BlogSidebar/Content';
import type {BlogSidebarItem} from '@docusaurus/plugin-content-blog';

// date 는 UTC 자정으로 저장된다. 로컬 게터를 쓰면 월말 글이 앞뒤 달로 밀린다.
function yearMonthKey(date: BlogSidebarItem['date']): string {
  const d = new Date(date);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

function formatYearMonthLabel(
  date: BlogSidebarItem['date'],
  locale: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(date));
}

// items 는 최신순. Map 삽입 순서가 그룹 순서가 된다.
function groupByYearMonth(
  items: BlogSidebarItem[],
  locale: string,
): {key: string; label: string; items: BlogSidebarItem[]}[] {
  const groups = new Map<
    string,
    {label: string; items: BlogSidebarItem[]}
  >();

  items.forEach((item) => {
    const key = yearMonthKey(item.date);
    const bucket = groups.get(key);
    if (bucket) {
      bucket.items.push(item);
    } else {
      groups.set(key, {
        label: formatYearMonthLabel(item.date, locale),
        items: [item],
      });
    }
  });

  return [...groups.entries()].map(([key, value]) => ({
    key,
    label: value.label,
    items: value.items,
  }));
}

function BlogSidebarContent({
  items,
  yearGroupHeadingClassName,
  ListComponent,
}: Props): ReactNode {
  const themeConfig = useThemeConfig();
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();

  if (!themeConfig.blog.sidebar.groupByYear) {
    return <ListComponent items={items} />;
  }

  return (
    <>
      {groupByYearMonth(items, currentLocale).map(({key, label, items: groupItems}) => (
        <div role="group" key={key}>
          <Heading as="h3" className={yearGroupHeadingClassName}>
            {label}
          </Heading>
          <ListComponent items={groupItems} />
        </div>
      ))}
    </>
  );
}

export default memo(BlogSidebarContent);

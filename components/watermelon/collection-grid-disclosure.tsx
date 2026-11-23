'use client';

// Watermelon UI Collection Grid Disclosure:
// https://ui.watermelon.sh/animated-components/collection-grid-disclosure
// Installed from the official registry. The shared-layout disclosure structure is preserved;
// its finance demo data and non-semantic controls are adapted for portfolio project evidence.

import { useId, useState, type ComponentType, type FC } from 'react';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  type Transition,
} from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Github01Icon } from '@hugeicons/core-free-icons';
import { ArrowUpRight, ChevronRight, X } from 'lucide-react';
import useMeasure from 'react-use-measure';

export interface CollectionItem {
  id: string;
  name: string;
  status: string;
  summary: string;
  technologies: readonly string[];
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  liveUrl: string;
  repoUrl?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  items: readonly CollectionItem[];
}

interface CollectionGridDisclosureProps {
  collections: readonly Collection[];
  className?: string;
}

const springConfig: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 24,
  mass: 1,
};

export const CollectionGridDisclosure: FC<CollectionGridDisclosureProps> = ({
  collections,
  className = '',
}) => {
  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      <motion.div
        className="flex w-full flex-col gap-3 will-change-transform"
        layout="position"
        transition={springConfig}
      >
        {collections.map((collection) => (
          <GridContainer key={collection.id} collection={collection} />
        ))}
      </motion.div>
    </div>
  );
};

function GridContainer({ collection }: { collection: Collection }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [measureRef, bounds] = useMeasure({ offsetSize: true });
  const reduceMotion = useReducedMotion();
  const regionId = useId();
  const transition = reduceMotion ? { duration: 0 } : springConfig;

  return (
    <MotionConfig transition={transition}>
      <motion.section
        className="overflow-hidden border border-[var(--line)] bg-[var(--surface)] text-[var(--fg)]"
        animate={{ height: bounds.height > 0 ? bounds.height : 'auto' }}
        data-expanded={isExpanded ? '' : undefined}
      >
        <div ref={measureRef}>
          <AnimatePresence mode="popLayout" initial={false} propagate>
            {!isExpanded ? (
              <motion.button
                key="collapsed"
                type="button"
                className="group grid min-h-32 w-full grid-cols-[auto_1fr_auto] items-center gap-5 px-5 py-6 text-left sm:gap-8 sm:px-8"
                onClick={() => setIsExpanded(true)}
                aria-expanded="false"
                aria-controls={regionId}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.1, ease: 'easeOut' }}
              >
                <span className="grid w-14 shrink-0 grid-cols-2 gap-1.5 sm:w-16">
                  {collection.items.slice(0, 4).map((item, index) => (
                    <motion.span
                      className="flex aspect-square items-center justify-center rounded-full bg-[var(--fg)] text-[var(--signal)]"
                      key={item.id}
                      layoutId={`collection-icon-${collection.id}-${item.id}`}
                      transition={{ ...springConfig, delay: reduceMotion ? 0 : index * 0.01 }}
                    >
                      <item.icon aria-hidden className="size-3.5 sm:size-4" />
                    </motion.span>
                  ))}
                </span>

                <span className="min-w-0">
                  <motion.span
                    layoutId={`collection-title-${collection.id}`}
                    layout="position"
                    className="block font-display text-[clamp(1.55rem,3vw,2.75rem)] font-medium leading-none tracking-[-0.035em]"
                  >
                    {collection.name}
                  </motion.span>
                  <span className="mt-3 block max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                    {collection.description}
                  </span>
                </span>

                <span className="flex items-center gap-3 text-sm text-[var(--muted)]">
                  <span className="hidden tabular-nums sm:inline">
                    {String(collection.items.length).padStart(2, '0')}
                  </span>
                  <ChevronRight
                    aria-hidden
                    className="size-6 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </span>
              </motion.button>
            ) : (
              <motion.div
                key="expanded"
                id={regionId}
                className="px-5 py-6 sm:px-8 sm:py-8"
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.08, ease: 'easeOut' }}
              >
                <motion.div className="flex items-start gap-6 border-b border-[var(--line)] pb-6" layout>
                  <motion.h3
                    className="flex-1 font-display text-[clamp(1.75rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.04em]"
                    layoutId={`collection-title-${collection.id}`}
                    layout="position"
                  >
                    {collection.name}
                  </motion.h3>
                  <button
                    type="button"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--line-strong)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--surface)]"
                    onClick={() => setIsExpanded(false)}
                    aria-label={`Collapse ${collection.name}`}
                    aria-expanded="true"
                    aria-controls={regionId}
                  >
                    <X aria-hidden className="size-5" />
                  </button>
                </motion.div>

                <ul className="divide-y divide-[var(--line)]">
                  {collection.items.map((item) => (
                    <li key={item.id} className="grid gap-5 py-7 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-7">
                      <motion.span
                        className="flex size-12 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--signal)]"
                        layoutId={`collection-icon-${collection.id}-${item.id}`}
                      >
                        <item.icon aria-hidden className="size-5" />
                      </motion.span>

                      <motion.div
                        className="min-w-0"
                        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                          <h4 className="font-display text-2xl font-medium tracking-[-0.025em]">{item.name}</h4>
                          <span className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
                            {item.status}
                          </span>
                        </div>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
                          {item.summary}
                        </p>
                        <ul aria-label={`${item.name} technologies`} className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-[0.12em] text-[var(--dim)]">
                          {item.technologies.map((technology) => (
                            <li key={technology}>{technology}</li>
                          ))}
                        </ul>
                      </motion.div>

                      <div className="flex items-center gap-2 sm:justify-end">
                        {item.repoUrl ? (
                          <a
                            href={item.repoUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="flex size-11 items-center justify-center rounded-full border border-[var(--line-strong)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--surface)]"
                            aria-label={`View ${item.name} source on GitHub (opens in a new tab)`}
                          >
                            <HugeiconsIcon aria-hidden icon={Github01Icon} className="size-4" />
                          </a>
                        ) : null}
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--fg)] px-5 text-sm font-medium text-[var(--surface)] transition-colors hover:bg-[var(--accent)]"
                        >
                          Open
                          <ArrowUpRight aria-hidden className="size-4" />
                          <span className="sr-only">{item.name} (opens in a new tab)</span>
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </MotionConfig>
  );
}

export const DisclosureCard = CollectionGridDisclosure;

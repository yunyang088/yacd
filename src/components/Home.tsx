import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import ContentHeader from './ContentHeader';
import s0 from './Home.module.scss';
import Loading from './Loading';
import TrafficChart from './TrafficChart';
import TrafficNow from './TrafficNow';
import { fetchVersion } from 'src/api/version';
import { useQuery } from '@tanstack/react-query';
import { getClashAPIConfig } from 'src/store/app';
import { ClashAPIConfig } from 'src/types';
import { connect } from 'src/components/StateProvider';
import { State } from 'src/store/types';

function ClashImpl({ apiConfig }) {
  const { data: version } = useQuery(['/version', apiConfig], () =>
    fetchVersion('/version', apiConfig)
  );

  return (
    <p>
        <span className={s0.mono}>Clash {version.premium ? "Premium ": ""}{version.version}</span>
    </p>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const mapState = (s: State) => ({
    apiConfig: getClashAPIConfig(s),
  });
  const ClashVersion = connect(mapState)(ClashImpl);

  return (
    <div>
      <ContentHeader title={t('Overview')} />
      <div className={s0.root}>
        <div>
          <ClashVersion />
        </div>
        <div>
          <TrafficNow />
        </div>
        <div className={s0.chart}>
          <Suspense fallback={<Loading height="200px" />}>
            <TrafficChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

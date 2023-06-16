import React, { useEffect, useState } from 'react';
import Website from '@/components/website';
import { IWebsiteResource } from '@/services/types';
import { getlatestData } from '@/services/user.service';

const Home = ({ services }: any) => {
  const [allServices, setAllServices] = useState<any>([]);
  const [allAgency, setAllAgency] = useState<any>([]);

  useEffect(() => {
    (async () => {
      const { landingPageData }: { landingPageData: any } =
        await getlatestData();
      setAllServices(landingPageData.services);
      setAllAgency(landingPageData.trusted_agency);
    })();
  }, []);

  return <Website {...{ allServices, allAgency }} />;
};

export default Home;

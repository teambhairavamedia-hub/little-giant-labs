export const blobMediaBaseUrl = "https://6xft9z0vzph7qrfh.public.blob.vercel-storage.com";

export const mediaUrls = {
  idfcCover: `${blobMediaBaseUrl}/media/idfc/cover-jYaxUmuyWHMwQXnUAicpcMULOwZWkV.jpg`,
  idfcVideo: `${blobMediaBaseUrl}/media/idfc/video-Bt4IUHGUoYCylDoaOkpiO6OCKNI1ji.mp4`,
  quberxCover: `${blobMediaBaseUrl}/media/quberx/cover-qvGLBDtuKOJ9WVQIIa99KUAYOcEFuC.jpeg`,
  quberxDetail1: `${blobMediaBaseUrl}/media/quberx/detail1-i0R0EHRObjBAXtG81lXirWNgd7Yhzp.jpeg`,
  quberxDetail2: `${blobMediaBaseUrl}/media/quberx/detail2-chNr2EGehB1oQI4Rq5UoHHWtI0gAyX.jpeg`,
  adhyakshCover: `${blobMediaBaseUrl}/media/song_1/cover-ig4m42lSOxVxDky1UKzo3QuyWZkt5G.webp`,
  dannyPanditCover: `${blobMediaBaseUrl}/media/song_2/cover-ofYGHs0KFj5hBXMqe6lQ9dfsRQAdj0.jpeg`,
  erikVinmayiCover: `${blobMediaBaseUrl}/media/song_3/cover-WRNpDfrTCKIpngYIFVW4DjeWUMk9xa.jpeg`,
  commercialSeriesCover: `${blobMediaBaseUrl}/media/song_4/cover-AEeKQ8e0uqPS51YwLndLlqF8T51ON1.jpeg`,
  founder: `${blobMediaBaseUrl}/media/founder/founder-f2ovW1aAw2yHLcv2XuCepudGIFnI91.jpg`,
  service01: `${blobMediaBaseUrl}/media/services/Little%20Giant%20Labs%20-%20service-01.mp4`,
  service02: `${blobMediaBaseUrl}/media/services/Little%20Giant%20Labs%20-%20service-02.mp4`,
  service03: `${blobMediaBaseUrl}/media/services/Little%20Giant%20Labs%20-%20service-03.mp4`,
} as const;

// Blob uses /media/services/ for these files; local copies are directly in /media/.
export const localMediaPathsByBlobPath: Record<string, string> = {
  "/media/services/Little%20Giant%20Labs%20-%20service-01.mp4": "/media/Little%20Giant%20Labs%20-%20service-01.mp4",
  "/media/services/Little%20Giant%20Labs%20-%20service-02.mp4": "/media/Little%20Giant%20Labs%20-%20service-02.mp4",
  "/media/services/Little%20Giant%20Labs%20-%20service-03.mp4": "/media/Little%20Giant%20Labs%20-%20service-03.mp4",
};

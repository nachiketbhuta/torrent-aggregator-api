interface TorrentBasicKeys {
  name?: string;
  magnet?: string;
  poster?: string;
  url?: string;
  torrentLink?: string;
}

interface TorrentKeys {
  category?: string;
  type?: string;
  language?: string;
  size?: string;
  uploadedBy?: string;
  downloads?: string;
  lastChecked?: string;
  dateUploaded?: string;
  seeders?: number;
  leechers?: number;
  author?: string;
  age?: number | string;
}

interface Torrent extends TorrentBasicKeys, TorrentKeys {
  [index: string | number]: number | string | undefined; // Index signature
}

export default Torrent;

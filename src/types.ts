type Tag = "MQA" | "HIRES_LOSSLESS" | "DOLBY_ATMOS" | "LOSSLESS";
type Item = {
	id: string;
	originalHTML?: string | null;
	mediaMetadata: {
		tags: Tag[];
	};
	album?: unknown;
};

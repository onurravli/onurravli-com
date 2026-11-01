export interface EmailField {
	label: string;
	value: string;
	/** Keep line breaks, e.g. for a contact message. */
	multiline?: boolean;
}

/** Owner notification: a title and labelled fields, styled inline for mail clients. */
export function NotificationEmail({
	title,
	fields,
}: {
	title: string;
	fields: EmailField[];
}) {
	return (
		<div
			style={{
				maxWidth: "42rem",
				margin: "0 auto",
				backgroundColor: "#ffffff",
				borderRadius: "8px",
				boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
				padding: "24px",
			}}
		>
			<h1
				style={{
					fontSize: "24px",
					fontWeight: 600,
					background: "linear-gradient(90deg, #9333EA 0%, #2563EB 100%)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
					textAlign: "center",
					margin: "0 0 40px",
				}}
			>
				{title}
			</h1>
			<div style={{ padding: "0 16px" }}>
				{fields.map((field) => (
					<div key={field.label} style={{ marginBottom: "24px" }}>
						<p
							style={{
								fontSize: "14px",
								fontWeight: 500,
								color: "#64748B",
								marginBottom: "8px",
							}}
						>
							{field.label}
						</p>
						<p
							style={{
								fontSize: "16px",
								color: "#1E293B",
								wordBreak: "break-word",
								whiteSpace: field.multiline ? "pre-wrap" : undefined,
							}}
						>
							{field.value}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

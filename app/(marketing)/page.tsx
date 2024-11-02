import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { Heroes } from "./_components/heroes";

const MarketingPage = () => {
	return (
		<div className="min-h-full flex flex-col">
			<div className="flex flex-col md:flex-row items-center justify-center gap-y-8 flex-1 px-6 pb-10">
				<div className="w-full md:w-1/2 flex justify-center">
					<Heading />
				</div>
				<div className="w-full md:w-1/2 flex justify-center">
					<Heroes />
				</div>
			</div>
			<Footer />
		</div>
	);
};
export default MarketingPage;

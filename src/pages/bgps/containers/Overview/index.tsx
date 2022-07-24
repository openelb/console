import Banner from "../../../../components/Card/Banner";

export default function Overview(props: { bannerProps?: any }) {
  function tips() {
    return [
      {
        title: "What is an Autonomous System (AS)?",
        description: "An autonomous system is a collection of connected Internet Protocol routing prefixes under the control of one or more network operators on behalf of a single administrative entity or domain, that presents a common and clearly defined routing policy to the Internet.",
      },
      {
        title: "How to configure local BGP properties and peer BGP properties using BgpConf and BgpPeer?",
        description: "You can easily create BgpConf and BgpPeer resource using the Web UI and that'll configure local BGP properties and peer BGP properties.",
      },
    ]
  }

  const { bannerProps } = props

  return (
    <div>
      <Banner
        {...bannerProps}
        title="BGP"
        description="BGP, Border Gateway Protocol, is a dynamic routing protocol that uses the TCP protocol for communication. BGP exchanges routing information between different autonomous systems (AS)."
        tips={tips()}
      />
    </div>
  )
}
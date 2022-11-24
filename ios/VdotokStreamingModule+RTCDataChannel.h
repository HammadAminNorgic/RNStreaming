#import "VdotokStreamingModule.h"
#import "DataChannelWrapper.h"

@interface RTCDataChannel (React)

@property (nonatomic, strong) NSNumber *peerConnectionId;

@end

@interface VdotokStreamingModule (RTCDataChannel) <DataChannelWrapperDelegate>

- (NSString *)stringForDataChannelState:(RTCDataChannelState)state;

@end

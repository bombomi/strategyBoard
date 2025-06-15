package me.kimbomin.board.service.strategy;


import lombok.RequiredArgsConstructor;
import me.kimbomin.board.dto.BoardResDto;
import me.kimbomin.board.repository.BoardRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PagingStrategy implements LoadStrategy{

    private final BoardRepository boardRepository;

    @Override
    public String getStrategyNm(){
        return "paging";
    }

    @Override
    @Transactional(readOnly = true)
    public List<BoardResDto> load(Pageable pageable, Long cursorId) {
        // Paging 전략에서는 cursorId를 사용하지 않습니다.
        return boardRepository.findAll(pageable)
                .getContent()
                .stream()
                .map(BoardResDto::from)
                .collect(Collectors.toList());
    }


}
